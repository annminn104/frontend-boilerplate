import { PrismaClient } from '@prisma/client'
import { Comment, CommentRepository, CreateCommentData, UpdateCommentData } from '../../core/entities/Comment'
import { NotFoundError } from '../../core/errors/ApplicationError'

const commentIncludes = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
      clerkId: true,
      avatar: true,
    },
  },
  post: {
    select: {
      id: true,
      title: true,
    },
  },
  likes: true,
  _count: {
    select: {
      likes: true,
      replies: true,
    },
  },
} as const

const replyIncludes = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
      clerkId: true,
      avatar: true,
    },
  },
  post: {
    select: {
      id: true,
      title: true,
    },
  },
  likes: true,
  _count: {
    select: {
      likes: true,
      replies: true,
    },
  },
} as const

export class PrismaCommentRepository implements CommentRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Comment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: commentIncludes,
    })
    return comment as unknown as Comment | null
  }

  async findByPostId(postId: string): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        postId,
        parentId: null,
        isSpam: false,
        isReported: false,
      },
      include: {
        ...commentIncludes,
        replies: {
          where: {
            isSpam: false,
            isReported: false,
          },
          include: replyIncludes,
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return comments as unknown as Comment[]
  }

  async findReplies(parentId: string): Promise<Comment[]> {
    const replies = await this.prisma.comment.findMany({
      where: {
        parentId,
        isSpam: false,
        isReported: false,
      },
      include: replyIncludes,
      orderBy: {
        createdAt: 'asc',
      },
    })
    return replies as unknown as Comment[]
  }

  async create(data: CreateCommentData): Promise<Comment> {
    const newComment = await this.prisma.comment.create({
      data,
      include: data.parentId ? replyIncludes : commentIncludes,
    })
    return newComment as unknown as Comment
  }

  async update(id: string, data: UpdateCommentData): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    })

    if (!comment) {
      throw new NotFoundError('Comment')
    }

    const updatedComment = await this.prisma.comment.update({
      where: { id },
      data,
      include: comment.parentId ? replyIncludes : commentIncludes,
    })
    return updatedComment as unknown as Comment
  }

  async delete(id: string): Promise<void> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    })

    if (!comment) {
      throw new NotFoundError('Comment')
    }

    await this.prisma.comment.delete({
      where: { id },
    })
  }

  async markAsSpam(id: string): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    })

    if (!comment) {
      throw new NotFoundError('Comment')
    }

    const updatedComment = await this.prisma.comment.update({
      where: { id },
      data: { isSpam: true },
      include: comment.parentId ? replyIncludes : commentIncludes,
    })
    return updatedComment as unknown as Comment
  }

  async markAsReported(id: string): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    })

    if (!comment) {
      throw new NotFoundError('Comment')
    }

    const updatedComment = await this.prisma.comment.update({
      where: { id },
      data: { isReported: true },
      include: comment.parentId ? replyIncludes : commentIncludes,
    })
    return updatedComment as unknown as Comment
  }
}
