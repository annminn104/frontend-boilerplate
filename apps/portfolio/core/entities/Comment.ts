import { User } from './User'

export interface CommentAuthor {
  id: string
  name: string | null
  email: string
  clerkId: string
  avatar: string | null
}

export interface CommentPost {
  id: string
  title: string
}

export interface CommentStats {
  likes: number
  replies: number
}

export interface CommentLike {
  id: string
  createdAt: Date
  postId: string
  userId: string
  commentId: string | null
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
  author: CommentAuthor
  post: CommentPost
  _count: CommentStats
  likes: CommentLike[]
  replies?: Comment[]
}

export type CreateCommentData = Pick<Comment, 'content' | 'postId' | 'authorId' | 'parentId' | 'isSpam' | 'isReported'>
export type UpdateCommentData = Partial<Pick<Comment, 'content' | 'isSpam' | 'isReported'>>

export interface CommentRepository {
  findById(id: string): Promise<Comment | null>
  findByPostId(postId: string): Promise<Comment[]>
  findReplies(parentId: string): Promise<Comment[]>
  create(comment: CreateCommentData): Promise<Comment>
  update(id: string, data: UpdateCommentData): Promise<Comment>
  delete(id: string): Promise<void>
  markAsSpam(id: string): Promise<Comment>
  markAsReported(id: string): Promise<Comment>
}
