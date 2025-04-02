export interface Author {
  id: string
  name: string | null
  email: string
  clerkId: string
  avatar: string
}

export interface Comment {
  id: string
  content: string
  postId: string
  authorId: string
  parentId?: string | null
  isSpam: boolean
  isReported: boolean
  createdAt: string
  updatedAt: string
  author: Author
  post: {
    id: string
    title: string
  }
  _count?: {
    likes: number
    replies: number
  }
  parent?: Comment | null
  replies?: Comment[]
  isAuthor: boolean
  isLiked: boolean
  likes: number
}

export interface CommentMetrics {
  totalComments: number
  totalSpam: number
  totalReported: number
  commentsToday: number
  commentsThisWeek: number
  commentsThisMonth: number
  topAuthors: Array<{
    authorId: string
    authorEmail: string
    count: number
  }>
  averageResponseTime: number
}
