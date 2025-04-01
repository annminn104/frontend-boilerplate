export type Comment = {
  id: string
  content: string
  postId: string
  authorId: string
  parentId: string | null
  isSpam: boolean
  isReported: boolean
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    name: string | null
    email: string
    clerkId: string
  }
  post: {
    id: string
    title: string
  }
  _count?: {
    likes: number
  }
  parent?: Comment | null
  replies?: Comment[]
}

export type CommentMetrics = {
  totalComments: number
  totalSpam: number
  totalReported: number
  commentsToday: number
  commentsThisWeek: number
  commentsThisMonth: number
  topAuthors: Array<{
    id: string
    name: string | null
    email: string
    count: number
  }>
  averageResponseTime: number
}
