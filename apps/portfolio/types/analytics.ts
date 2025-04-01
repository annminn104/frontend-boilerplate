export type CommentMetrics = {
  totalComments: number
  totalSpam: number
  totalReported: number
  commentsToday: number
  commentsThisWeek: number
  commentsThisMonth: number
  topAuthors: Array<{
    name: string
    email: string
    count: number
  }>
  averageResponseTime: number
}

export type PostMetrics = {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
  averageViewsPerPost: number
  totalComments: number
  averageCommentsPerPost: number
  totalLikes: number
  averageLikesPerPost: number
}
