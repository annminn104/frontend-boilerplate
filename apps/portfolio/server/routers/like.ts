import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import type { Prisma } from '@prisma/client'

export const likeRouter = router({
  like: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingLike = await ctx.prisma.like.findFirst({
        where: {
          commentId: input.commentId,
          userId: ctx.auth.userId!,
        },
      })

      if (existingLike) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You have already liked this comment',
        })
      }

      const comment = await ctx.prisma.comment.findUnique({
        where: { id: input.commentId },
      })

      if (!comment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Comment not found',
        })
      }

      if (comment.isSpam || comment.isReported) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot like a spam or reported comment',
        })
      }

      await ctx.prisma.like.create({
        data: {
          userId: ctx.auth.userId!,
          commentId: input.commentId,
        },
      })

      return { success: true }
    }),

  unlike: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const like = await ctx.prisma.like.findFirst({
        where: {
          commentId: input.commentId,
          userId: ctx.auth.userId!,
        },
      })

      if (!like) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Like not found',
        })
      }

      await ctx.prisma.like.delete({
        where: { id: like.id },
      })

      return { success: true }
    }),

  getLikeCount: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const count = await ctx.prisma.like.count({
        where: {
          commentId: input.commentId,
        },
      })

      return count
    }),

  isLiked: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const like = await ctx.prisma.like.findFirst({
        where: {
          commentId: input.commentId,
          userId: ctx.auth.userId!,
        },
      })

      return !!like
    }),
})
