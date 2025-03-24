import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { postSchema } from '@/lib/validations/blog'
import { TRPCError } from '@trpc/server'
import { Post } from '@/types/blog'

export const postRouter = router({
  // Get all published posts
  getAllPublished: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return posts.map(post => ({
      ...post,
      author: {
        name: post.author.name || post.author.email.split('@')[0],
      },
      comments: post.comments.map(comment => ({
        ...comment,
        author: {
          name: comment.author.name || comment.author.email.split('@')[0],
        },
      })),
      _count: {
        likes: post._count.likes,
        comments: post._count.comments,
      },
    })) as Post[]
  }),

  // Get a single post by ID
  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const post = await ctx.prisma.post.findUnique({
      where: { id: input },
      include: {
        author: {
          select: { name: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    })

    if (!post) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Post not found',
      })
    }

    return post
  }),

  // Create a new post (protected)
  create: protectedProcedure.input(postSchema).mutation(async ({ ctx, input }) => {
    const userId = ctx.auth.userId
    if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' })

    const user = await ctx.prisma.user.findUnique({
      where: { clerkId: userId },
    })
    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    return ctx.prisma.post.create({
      data: {
        ...input,
        authorId: user.id,
      },
    })
  }),

  // Update a post (protected)
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: postSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.id },
        include: { author: true },
      })

      if (!post) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' })
      }

      if (post.author.clerkId !== ctx.auth.userId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized to update this post' })
      }

      return ctx.prisma.post.update({
        where: { id: input.id },
        data: input.data,
      })
    }),

  // Delete a post (protected)
  delete: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const post = await ctx.prisma.post.findUnique({
      where: { id: input },
      include: { author: true },
    })

    if (!post) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' })
    }

    if (post.author.clerkId !== ctx.auth.userId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized to delete this post' })
    }

    return ctx.prisma.post.delete({
      where: { id: input },
    })
  }),

  // Like a post (protected)
  toggleLike: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const userId = ctx.auth.userId
    if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' })

    const user = await ctx.prisma.user.findUnique({
      where: { clerkId: userId },
    })
    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    const existingLike = await ctx.prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: input,
          userId: user.id,
        },
      },
    })

    if (existingLike) {
      return ctx.prisma.like.delete({
        where: { id: existingLike.id },
      })
    }

    return ctx.prisma.like.create({
      data: {
        postId: input,
        userId: user.id,
      },
    })
  }),

  // Get likes count for a post
  getLikesCount: publicProcedure.input(z.string()).query(async ({ ctx, input: postId }) => {
    return await ctx.prisma.like.count({
      where: { postId },
    })
  }),

  // Check if user has liked a post
  hasLiked: protectedProcedure.input(z.string()).query(async ({ ctx, input: postId }) => {
    const like = await ctx.prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: ctx.auth.userId,
        },
      },
    })
    return !!like
  }),

  // Get all comments for a post
  getComments: publicProcedure.input(z.string()).query(async ({ ctx, input: postId }) => {
    return await ctx.prisma.comment.findMany({
      where: { postId },
      include: {
        author: true,
        likes: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }),

  // Add a comment to a post (protected)
  addComment: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.userId
      if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' })

      const user = await ctx.prisma.user.findUnique({
        where: { clerkId: userId },
      })
      if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

      return ctx.prisma.comment.create({
        data: {
          content: input.content,
          postId: input.postId,
          authorId: user.id,
        },
      })
    }),

  // Delete a comment (protected, owner or post author only)
  deleteComment: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const comment = await ctx.prisma.comment.findUnique({
      where: { id: input },
      include: { author: true },
    })

    if (!comment) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found' })
    }

    if (comment.author.clerkId !== ctx.auth.userId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized to delete this comment' })
    }

    return ctx.prisma.comment.delete({
      where: { id: input },
    })
  }),
})
