import { z } from 'zod'
import { router, ownerProcedure } from '../trpc'
import type { CommentMetrics, PostMetrics } from '../../types/analytics'

export const analyticsRouter = router({
  getCommentMetrics: ownerProcedure.query(async ({ ctx }): Promise<CommentMetrics> => {
    const [
      totalComments,
      spamComments,
      reportedComments,
      commentsToday,
      commentsThisWeek,
      commentsThisMonth,
      topAuthors,
    ] = await Promise.all([
      // Total comments
      ctx.prisma.comment.count(),

      // Spam comments
      ctx.prisma.comment.count({
        where: { isSpam: true },
      }),

      // Reported comments
      ctx.prisma.comment.count({
        where: { isReported: true },
      }),

      // Comments today
      ctx.prisma.comment.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),

      // Comments this week
      ctx.prisma.comment.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      }),

      // Comments this month
      ctx.prisma.comment.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(1)),
          },
        },
      }),

      // Top authors
      ctx.prisma.comment
        .groupBy({
          by: ['authorId'],
          _count: {
            authorId: true,
          },
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
            count: group._count.authorId,
          }))
        }),
    ])

    // Calculate average response time (mock data for now)
    const averageResponseTime = 24 // hours

    return {
      totalComments,
      totalSpam: spamComments,
      totalReported: reportedComments,
      commentsToday,
      commentsThisWeek,
      commentsThisMonth,
      topAuthors: topAuthors.map(author => ({
        name: author.name || author.email.split('@')[0],
        email: author.email,
        count: author.count,
      })),
      averageResponseTime,
    }
  }),

  getPostMetrics: ownerProcedure.query(async ({ ctx }): Promise<PostMetrics> => {
    const [totalPosts, publishedPosts, draftPosts, totalViews, totalComments, totalLikes] = await Promise.all([
      // Total posts
      ctx.prisma.post.count(),

      // Published posts
      ctx.prisma.post.count({
        where: { published: true },
      }),

      // Draft posts
      ctx.prisma.post.count({
        where: { published: false },
      }),

      // Total views (mock data for now)
      Promise.resolve(1000),

      // Total comments
      ctx.prisma.comment.count({
        where: { isSpam: false },
      }),

      // Total likes
      ctx.prisma.like.count({
        where: { commentId: null }, // Only post likes
      }),
    ])

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      averageViewsPerPost: Math.round(totalViews / (publishedPosts || 1)),
      totalComments,
      averageCommentsPerPost: Math.round(totalComments / (publishedPosts || 1)),
      totalLikes,
      averageLikesPerPost: Math.round(totalLikes / (publishedPosts || 1)),
    }
  }),
})
