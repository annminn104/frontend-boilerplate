import { z } from 'zod'
import { router, publicProcedure, protectedProcedure, ownerProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { observable } from '@trpc/server/observable'
import { EventEmitter } from 'events'
import { type Comment, type CommentReply } from '@/types/comment'
import { type Prisma } from '@prisma/client'

// Create an event emitter for comment events
const ee = new EventEmitter()

type CommentInclude = {
  author: {
    select: {
      id: true
      name: true
      email: true
      clerkId: true
      avatar: true
    }
  }
  post: {
    select: {
      id: true
      title: true
    }
  }
  _count: {
    select: {
      likes: true
      replies: true
    }
  }
  likes: true
}

type ReplyInclude = CommentInclude & {
  replies: {
    include: CommentInclude
  }
}

const replyInclude: CommentInclude = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
      clerkId: true,
      avatar: true,
    },
  },
  post: {
    select: {
      id: true,
      title: true,
    },
  },
  _count: {
    select: {
      likes: true,
      replies: true,
    },
  },
  likes: true,
} as const

const commentInclude: ReplyInclude = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
      clerkId: true,
      avatar: true,
    },
  },
  post: {
    select: {
      id: true,
      title: true,
    },
  },
  _count: {
    select: {
      likes: true,
      replies: true,
    },
  },
  replies: {
    include: replyInclude,
  },
  likes: true,
} as const

type PrismaCommentWithIncludes = Prisma.CommentGetPayload<{
  include: typeof commentInclude
}>

type PrismaReplyWithIncludes = Prisma.CommentGetPayload<{
  include: typeof replyInclude
}>

// Helper function to format reply response
const formatReplyResponse = (reply: PrismaReplyWithIncludes, userId?: string): CommentReply => ({
  id: reply.id,
  content: reply.content,
  postId: reply.postId,
  authorId: reply.authorId,
  parentId: reply.parentId,
  isSpam: reply.isSpam,
  isReported: reply.isReported,
  createdAt: reply.createdAt,
  updatedAt: reply.updatedAt,
  author: {
    id: reply.author.id,
    name: reply.author.name,
    email: reply.author.email,
    clerkId: reply.author.clerkId,
    avatar: reply.author.avatar || `https://api.dicebear.com/7.x/avatars/svg?seed=${reply.author.email}`,
  },
  post: {
    id: reply.post.id,
    title: reply.post.title,
  },
  _count: {
    likes: reply._count.likes,
    replies: reply._count.replies,
  },
  likes: reply.likes,
  isAuthor: userId ? reply.authorId === userId : false,
  isLiked: userId ? reply.likes.some(like => like.userId === userId) : false,
})

// Helper function to format comment response
const formatCommentResponse = (comment: PrismaCommentWithIncludes, userId?: string): Comment => ({
  id: comment.id,
  content: comment.content,
  postId: comment.postId,
  authorId: comment.authorId,
  parentId: comment.parentId,
  isSpam: comment.isSpam,
  isReported: comment.isReported,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
  author: {
    id: comment.author.id,
    name: comment.author.name,
    email: comment.author.email,
    clerkId: comment.author.clerkId,
    avatar: comment.author.avatar || `https://api.dicebear.com/7.x/avatars/svg?seed=${comment.author.email}`,
  },
  post: {
    id: comment.post.id,
    title: comment.post.title,
  },
  _count: {
    likes: comment._count.likes,
    replies: comment._count.replies,
  },
  replies: comment.replies?.map(reply => formatReplyResponse(reply, userId)) || [],
  isAuthor: userId ? comment.authorId === userId : false,
  isLiked: userId ? comment.likes.some(like => like.userId === userId) : false,
  likes: comment._count.likes,
})

export const commentRouter = router({
  // Get all comments for admin
  getAllForAdmin: ownerProcedure.query(async ({ ctx }): Promise<Comment[]> => {
    const { prisma } = ctx
    const comments = (await prisma.comment.findMany({
      include: commentInclude,
      orderBy: { createdAt: 'desc' },
    })) as unknown as PrismaCommentWithIncludes[]

    return comments.map(comment => formatCommentResponse(comment))
  }),

  // Get comments by post ID
  getByPostId: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { prisma, auth } = ctx
      const comments = await prisma.comment.findMany({
        where: {
          postId: input.postId,
          isSpam: false,
          isReported: false,
          parentId: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: commentInclude,
      })

      return comments.map(comment =>
        formatCommentResponse(
          {
            ...comment,
            parentId: comment.parentId ?? null,
          } as PrismaCommentWithIncludes,
          auth.userId!
        )
      )
    }),

  // Create a new comment
  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        postId: z.string(),
        parentId: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, auth } = ctx
      const comment = await prisma.comment.create({
        data: {
          content: input.content,
          postId: input.postId,
          parentId: input.parentId ?? null,
          authorId: auth.userId!,
        },
        include: commentInclude,
      })

      const formattedComment = formatCommentResponse(
        {
          ...comment,
          parentId: comment.parentId ?? null,
        } as unknown as PrismaCommentWithIncludes,
        auth.userId!
      )

      ee.emit('newComment', formattedComment)
      return formattedComment
    }),

  // Update a comment
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, auth } = ctx
      const comment = await prisma.comment.findUnique({
        where: { id: input.id },
        include: { author: true },
      })

      if (!comment) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found' })
      }

      if (comment.author.clerkId !== auth.userId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized' })
      }

      const updatedComment = await prisma.comment.update({
        where: { id: input.id },
        data: { content: input.content },
        include: commentInclude,
      })

      const formattedComment = formatCommentResponse(updatedComment, auth.userId)

      ee.emit('commentUpdated', formattedComment)
      return formattedComment
    }),

  // Delete a comment
  delete: protectedProcedure.input(z.string()).mutation(async ({ ctx, input: id }) => {
    const { prisma, auth } = ctx
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: { author: true },
    })

    if (!comment) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found' })
    }

    if (comment.author.clerkId !== auth.userId) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Not authorized' })
    }

    await prisma.comment.delete({ where: { id } })
    ee.emit('commentDeleted', id)
    return { success: true }
  }),

  // Like a comment
  likeComment: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const { prisma, auth } = ctx
    const comment = await prisma.comment.findUnique({
      where: { id: input.id },
      select: { postId: true },
    })

    if (!comment) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Comment not found',
      })
    }

    const like = await prisma.like.create({
      data: {
        userId: auth.userId!,
        commentId: input.id,
        postId: comment.postId,
      },
      select: {
        id: true,
        userId: true,
        commentId: true,
        postId: true,
        createdAt: true,
      },
    })

    return like
  }),

  // Unlike a comment
  unlikeComment: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const { prisma, auth } = ctx
    const like = await prisma.like.findFirst({
      where: {
        commentId: input.id,
        userId: auth.userId!,
      },
    })

    if (!like) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Like not found',
      })
    }

    await prisma.like.delete({
      where: { id: like.id },
    })

    return { success: true }
  }),

  // Get comment metrics for analytics
  getCommentMetrics: ownerProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [totalComments, totalSpam, totalReported, commentsToday, commentsThisWeek, commentsThisMonth, topAuthors] =
      await Promise.all([
        prisma.comment.count(),
        prisma.comment.count({ where: { isSpam: true } }),
        prisma.comment.count({ where: { isReported: true } }),
        prisma.comment.count({ where: { createdAt: { gte: startOfToday } } }),
        prisma.comment.count({ where: { createdAt: { gte: startOfWeek } } }),
        prisma.comment.count({ where: { createdAt: { gte: startOfMonth } } }),
        prisma.comment
          .groupBy({
            by: ['authorId'],
            _count: true,
            orderBy: {
              _count: {
                authorId: 'desc',
              },
            },
            take: 5,
            where: { isSpam: false },
          })
          .then(async groups => {
            const authors = await prisma.user.findMany({
              where: { id: { in: groups.map(g => g.authorId) } },
              select: { id: true, name: true, email: true },
            })
            return groups.map(group => ({
              ...authors.find(a => a.id === group.authorId)!,
              count: group._count || 0,
            }))
          }),
      ])

    // Calculate average response time (time between consecutive comments)
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
      where: { isSpam: false },
    })

    let totalResponseTime = 0
    let responseCount = 0
    for (let i = 1; i < comments.length; i++) {
      const timeDiff = comments[i].createdAt.getTime() - comments[i - 1].createdAt.getTime()
      totalResponseTime += timeDiff
      responseCount++
    }

    const averageResponseTime =
      responseCount > 0
        ? Math.round(totalResponseTime / responseCount / (1000 * 60 * 60)) // Convert to hours
        : 0

    return {
      totalComments,
      totalSpam,
      totalReported,
      commentsToday,
      commentsThisWeek,
      commentsThisMonth,
      topAuthors,
      averageResponseTime,
    }
  }),

  // WebSocket subscription for new comments
  onNewComment: ownerProcedure.subscription(() => {
    return observable<Comment>(emit => {
      const onComment = (data: Comment) => {
        emit.next(data)
      }
      ee.on('newComment', onComment)
      return () => {
        ee.off('newComment', onComment)
      }
    })
  }),

  // WebSocket subscription for comment updates
  onCommentUpdated: ownerProcedure.subscription(() => {
    return observable<Comment>(emit => {
      const onUpdate = (data: Comment) => {
        emit.next(data)
      }
      ee.on('commentUpdated', onUpdate)
      return () => {
        ee.off('commentUpdated', onUpdate)
      }
    })
  }),

  // WebSocket subscription for comment deletions
  onCommentDeleted: ownerProcedure.subscription(() => {
    return observable<string>(emit => {
      const onDelete = (commentId: string) => {
        emit.next(commentId)
      }
      ee.on('commentDeleted', onDelete)
      return () => {
        ee.off('commentDeleted', onDelete)
      }
    })
  }),

  // Update comment status (spam/reported)
  updateStatus: ownerProcedure
    .input(
      z.object({
        id: z.string(),
        isSpam: z.boolean().optional(),
        isReported: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }): Promise<Comment> => {
      const { prisma } = ctx
      const comment = await prisma.comment.findUnique({
        where: { id: input.id },
        include: commentInclude,
      })

      if (!comment) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found' })
      }

      const updatedComment = await prisma.comment.update({
        where: { id: input.id },
        data: {
          isSpam: input.isSpam ?? comment.isSpam,
          isReported: input.isReported ?? comment.isReported,
        },
        include: commentInclude,
      })

      // Emit update event
      ee.emit('commentUpdated', formatCommentResponse(updatedComment))

      return formatCommentResponse(updatedComment)
    }),

  // Bulk update comment status
  bulkUpdateStatus: ownerProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
        isSpam: z.boolean().optional(),
        isReported: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx
      const result = await prisma.comment.updateMany({
        where: { id: { in: input.ids } },
        data: {
          isSpam: input.isSpam,
          isReported: input.isReported,
        },
      })

      // Get updated comments
      const updatedComments = await prisma.comment.findMany({
        where: { id: { in: input.ids } },
        include: commentInclude,
      })

      // Emit update events
      updatedComments.forEach(comment => {
        ee.emit('commentUpdated', formatCommentResponse(comment))
      })

      return result
    }),

  // Delete a comment (admin only)
  adminDeleteComment: ownerProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const { prisma } = ctx
    const comment = await prisma.comment.findUnique({
      where: { id: input },
    })

    if (!comment) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found' })
    }

    await prisma.comment.delete({
      where: { id: input },
    })

    // Emit delete event
    ee.emit('commentDeleted', input)

    return { success: true }
  }),

  // Update comment content
  updateContent: ownerProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }): Promise<Comment> => {
      const { prisma } = ctx
      const comment = await prisma.comment.findUnique({
        where: { id: input.id },
        include: commentInclude,
      })

      if (!comment) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found' })
      }

      const updatedComment = await prisma.comment.update({
        where: { id: input.id },
        data: {
          content: input.content,
        },
        include: commentInclude,
      })

      const formattedComment = formatCommentResponse(updatedComment)
      ee.emit('commentUpdated', formattedComment)
      return formattedComment
    }),

  // Reply to a comment
  replyToComment: protectedProcedure
    .input(
      z.object({
        parentId: z.string(),
        postId: z.string(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }): Promise<Comment> => {
      const { prisma, auth } = ctx
      const parentComment = await prisma.comment.findUnique({
        where: { id: input.parentId },
      })

      if (!parentComment) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Parent comment not found' })
      }

      const newComment = await prisma.comment.create({
        data: {
          content: input.content,
          postId: input.postId,
          authorId: auth.userId!,
          parentId: input.parentId,
        },
        include: commentInclude,
      })

      const formattedComment = formatCommentResponse(newComment, auth.userId!)
      ee.emit('newComment', formattedComment)
      return formattedComment
    }),
})
