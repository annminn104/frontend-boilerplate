import { z } from 'zod'
import { router, publicProcedure, protectedProcedure, ownerProcedure } from '../trpc'
import { postSchema } from '@/lib/validations/blog'
import { TRPCError } from '@trpc/server'
import { Post } from '@/types/blog'

export const postRouter = router({
  // Get all published posts
  getAllPublished: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            clerkId: true,
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

    const result = posts.map(post => ({
      ...post,
      author: {
        id: post.author.id,
        email: post.author.email,
        clerkId: post.author.clerkId,
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
    }))

    return result
  }),

  // Get all posts for admin (including drafts)
  getAllForAdmin: ownerProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return posts
  }),

  // Get a single post by ID
  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const { prisma } = ctx
    const post = await prisma.post.findUnique({
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
  create: ownerProcedure.input(postSchema).mutation(async ({ ctx, input }) => {
    const { prisma, auth } = ctx
    const userId = auth.userId
    if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' })

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    })
    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    return prisma.post.create({
      data: {
        ...input,
        authorId: user.id,
      },
    })
  }),

  // Update a post (protected)
  update: ownerProcedure
    .input(
      z.object({
        id: z.string(),
        data: postSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx
      const post = await prisma.post.findUnique({
        where: { id: input.id },
        include: { author: true },
      })

      if (!post) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' })
      }

      return prisma.post.update({ where: { id: input.id }, data: input.data })
    }),

  // Delete a post (protected)
  delete: ownerProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const { prisma } = ctx
    const post = await prisma.post.findUnique({
      where: { id: input },
    })

    if (!post) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Post not found' })
    }

    return prisma.post.delete({ where: { id: input } })
  }),

  // Like a post (protected)
  toggleLike: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const { prisma, auth } = ctx
    if (!auth.userId) throw new TRPCError({ code: 'UNAUTHORIZED' })

    const user = await prisma.user.findUnique({
      where: { clerkId: auth.userId },
    })
    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: input,
          userId: user.id,
        },
      },
    })

    if (existingLike) {
      return prisma.like.delete({ where: { id: existingLike.id } })
    }

    return prisma.like.create({
      data: {
        postId: input,
        userId: user.id,
      },
    })
  }),

  // Get likes count for a post
  getLikesCount: publicProcedure.input(z.string()).query(async ({ ctx, input: postId }) => {
    const { prisma } = ctx
    return await prisma.like.count({
      where: { postId },
    })
  }),

  // Check if user has liked a post
  hasLiked: protectedProcedure.input(z.string()).query(async ({ ctx, input: postId }) => {
    const { prisma, auth } = ctx
    const like = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: auth.userId!,
        },
      },
    })
    return !!like
  }),

  // Get all comments for a post
  getComments: publicProcedure.input(z.string()).query(async ({ ctx, input: postId }) => {
    const { prisma } = ctx
    return await prisma.comment.findMany({
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
      const { prisma, auth } = ctx
      if (!auth.userId) throw new TRPCError({ code: 'UNAUTHORIZED' })

      const user = await prisma.user.findUnique({
        where: { clerkId: auth.userId },
      })
      if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

      return prisma.comment.create({
        data: {
          content: input.content,
          postId: input.postId,
          authorId: user.id,
        },
      })
    }),

  // Delete a comment (protected, owner or post author only)
  deleteComment: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const { prisma, auth } = ctx
    const comment = await prisma.comment.findUnique({
      where: { id: input },
      include: { author: true },
    })

    if (!comment) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found' })
    }

    // Allow deletion if user is the comment author
    if (comment.author.clerkId === auth.userId) {
      return prisma.comment.delete({
        where: { id: input },
      })
    }

    // Otherwise, check if user is an OWNER
    const user = await prisma.user.findUnique({
      where: { clerkId: auth.userId! },
    })

    // Check if user is an OWNER
    const isOwner = await prisma.user.findUnique({
      where: { clerkId: auth.userId!, role: 'OWNER' },
    })

    if (user && isOwner && user.id === isOwner.id) {
      return prisma.comment.delete({
        where: { id: input },
      })
    }

    throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized to delete this comment' })
  }),

  updateStatus: ownerProcedure
    .input(
      z.object({
        id: z.string(),
        published: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx
      const post = await prisma.post.update({
        where: { id: input.id },
        data: { published: input.published },
        include: {
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
      })
      return post
    }),
})
