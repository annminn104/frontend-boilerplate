import { Post as PrismaPost, Comment } from '@fe-boilerplate/core/prisma/client/default.js'

interface Author {
  id: string
  name: string
  email: string
  clerkId: string
}

interface CommentWithAuthor extends Omit<Comment, 'author'> {
  author: {
    id: string
    name: string
    email: string
  }
}

export interface Post extends Omit<PrismaPost, 'author' | 'comments'> {
  author: Author
  comments: CommentWithAuthor[]
  _count: {
    likes: number
    comments: number
  }
}
