import { z } from 'zod'
import { router, publicProcedure, protectedProcedure, ownerProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { observable } from '@trpc/server/observable'
import { EventEmitter } from 'events'
import { type Comment } from '@/types/comment'

// Create an event emitter for comment events
const ee = new EventEmitter()

// Helper function to format comment response
const formatCommentResponse = (comment: any): Comment => ({
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
    name: comment.author.name || comment.author.email.split('@')[0],
    email: comment.author.email,
    clerkId: comment.author.clerkId,
  },
  post: {
    id: comment.post.id,
    title: comment.post.title,
  },
  _count: comment._count,
  parent: comment.parent,
  replies: comment.replies,
})

export const commentRouter = router({
  // Get all comments for admin
  getAllForAdmin: ownerProcedure.query(async ({ ctx }): Promise<Comment[]> => {
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
        _count: {
          select: {
            likes: true,
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

  // Get comment metrics for analytics
  getCommentMetrics: ownerProcedure.query(async ({ ctx }) => {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [totalComments, totalSpam, totalReported, commentsToday, commentsThisWeek, commentsThisMonth, topAuthors] =
      await Promise.all([
        ctx.prisma.comment.count(),
        ctx.prisma.comment.count({ where: { isSpam: true } }),
        ctx.prisma.comment.count({ where: { isReported: true } }),
        ctx.prisma.comment.count({ where: { createdAt: { gte: startOfToday } } }),
        ctx.prisma.comment.count({ where: { createdAt: { gte: startOfWeek } } }),
        ctx.prisma.comment.count({ where: { createdAt: { gte: startOfMonth } } }),
        ctx.prisma.comment
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
            const authors = await ctx.prisma.user.findMany({
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
    const comments = await ctx.prisma.comment.findMany({
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
      const comment = await ctx.prisma.comment.findUnique({
        where: { id: input.id },
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
          _count: {
            select: {
              likes: true,
            },
          },
        },
      })

      if (!comment) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found' })
      }

      const updatedComment = await ctx.prisma.comment.update({
        where: { id: input.id },
        data: {
          isSpam: input.isSpam ?? comment.isSpam,
          isReported: input.isReported ?? comment.isReported,
        },
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
          _count: {
            select: {
              likes: true,
            },
          },
        },
      })

      // Emit update event
      ee.emit('commentUpdated', updatedComment)

      return {
        ...updatedComment,
        author: {
          ...updatedComment.author,
          name: updatedComment.author.name || updatedComment.author.email.split('@')[0],
        },
      }
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
      const result = await ctx.prisma.comment.updateMany({
        where: { id: { in: input.ids } },
        data: {
          isSpam: input.isSpam,
          isReported: input.isReported,
        },
      })

      // Get updated comments
      const updatedComments = await ctx.prisma.comment.findMany({
        where: { id: { in: input.ids } },
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
          _count: {
            select: {
              likes: true,
            },
          },
        },
      })

      // Emit update events
      updatedComments.forEach(comment => {
        ee.emit('commentUpdated', comment)
      })

      return result
    }),

  // Delete a comment (admin only)
  adminDeleteComment: ownerProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const comment = await ctx.prisma.comment.findUnique({
      where: { id: input },
    })

    if (!comment) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found' })
    }

    await ctx.prisma.comment.delete({
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
      const comment = await ctx.prisma.comment.findUnique({
        where: { id: input.id },
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
          _count: {
            select: {
              likes: true,
            },
          },
        },
      })

      if (!comment) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Comment not found' })
      }

      const updatedComment = await ctx.prisma.comment.update({
        where: { id: input.id },
        data: {
          content: input.content,
        },
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
          _count: {
            select: {
              likes: true,
            },
          },
        },
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
      const parentComment = await ctx.prisma.comment.findUnique({
        where: { id: input.parentId },
      })

      if (!parentComment) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Parent comment not found' })
      }

      const newComment = await ctx.prisma.comment.create({
        data: {
          content: input.content,
          postId: input.postId,
          authorId: ctx.auth.userId,
          parentId: input.parentId,
        },
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
          _count: {
            select: {
              likes: true,
            },
          },
        },
      })

      const formattedComment = formatCommentResponse(newComment)
      ee.emit('newComment', formattedComment)
      return formattedComment
    }),
})
