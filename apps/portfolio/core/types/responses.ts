export interface UserResponse {
  id: string
  name: string
  email: string
  clerkId: string
  avatar: string | null
}

export interface PostResponse {
  id: string
  title: string
}

export interface CommentStatsResponse {
  likes: number
  replies: number
}

export interface CommentReplyResponse {
  id: string
  content: string
  postId: string
  authorId: string
  parentId: string | null
  isSpam: boolean
  isReported: boolean
  createdAt: Date
  updatedAt: Date
  author: UserResponse
  post: PostResponse
  _count: CommentStatsResponse
  likes: number
  isAuthor: boolean
  isLiked: boolean
}

export interface CommentResponse extends Omit<CommentReplyResponse, 'likes'> {
  replies: CommentReplyResponse[]
  likes: number
}

export interface SuccessResponse {
  success: boolean
}
