export type CommentAuthor = {
  id: string
  name: string | null
  email: string
  clerkId: string
  avatar: string | null
}

export type CommentPost = {
  id: string
  title: string
}

export type CommentCount = {
  likes: number
  replies: number
}

export type CommentLike = {
  id: string
  userId: string
  commentId: string | null
  postId: string | null
  createdAt: Date
}

export type CommentReply = {
  id: string
  content: string
  postId: string
  authorId: string
  parentId: string | null
  isSpam: boolean
  isReported: boolean
  createdAt: Date
  updatedAt: Date
  author: CommentAuthor
  post: CommentPost
  _count: CommentCount
  likes: CommentLike[]
  isAuthor: boolean
  isLiked: boolean
}

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
  author: CommentAuthor
  post: CommentPost
  _count: CommentCount
  replies: CommentReply[]
  isAuthor: boolean
  isLiked: boolean
  likes: number
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
