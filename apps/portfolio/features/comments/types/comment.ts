export interface Author {
  id: string
  name: string | null
  email: string
  avatar: string | null
}

export interface CommentLike {
  id: string
  userId: string
  commentId: string | null
  postId: string | null
  createdAt: Date
}

export interface CommentReply {
  id: string
  content: string
  postId: string
  authorId: string
  parentId: string | null
  isSpam: boolean
  isReported: boolean
  createdAt: Date
  updatedAt: Date
  author: Author
  post: {
    id: string
    title: string
  }
  _count: {
    likes: number
    replies: number
  }
  likes: CommentLike[]
  isAuthor: boolean
  isLiked: boolean
}

export interface Comment {
  id: string
  content: string
  postId: string
  authorId: string
  parentId: string | null
  isSpam: boolean
  isReported: boolean
  createdAt: Date
  updatedAt: Date
  author: Author
  post: {
    id: string
    title: string
  }
  _count: {
    likes: number
    replies: number
  }
  parent?: Comment | null
  replies: CommentReply[]
  likes: CommentLike[]
  isAuthor: boolean
  isLiked: boolean
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
