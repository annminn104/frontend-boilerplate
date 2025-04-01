import { z } from 'zod'
import { router, publicProcedure, protectedProcedure, ownerProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'

export const commentRouter = router({
  // Get all comments for admin
  getAllForAdmin: ownerProcedure.query(async ({ ctx }) => {
    const comments = await ctx.prisma.comment.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            clerkId: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return comments.map(comment => ({
      ...comment,
      author: {
        ...comment.author,
        name: comment.author.name || comment.author.email.split('@')[0],
      },
    }))
  }),

  // Delete a comment (admin only)
  adminDeleteComment: ownerProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const comment = await ctx.prisma.comment.findUnique({
      where: { id: input },
    })

    if (!comment) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found' })
    }

    return ctx.prisma.comment.delete({
      where: { id: input },
    })
  }),
})
