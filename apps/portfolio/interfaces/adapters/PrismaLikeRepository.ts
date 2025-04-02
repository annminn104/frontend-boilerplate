import { PrismaClient } from '@prisma/client'
import { Like, LikeRepository } from '../../core/entities/Like'

export class PrismaLikeRepository implements LikeRepository {
  constructor(private prisma: PrismaClient) {}

  async create(userId: string, commentId: string): Promise<Like> {
    const like = await this.prisma.like.create({
      data: {
        userId,
        commentId,
      },
    })
    return like as Like
  }

  async delete(userId: string, commentId: string): Promise<void> {
    await this.prisma.like.deleteMany({
      where: {
        userId,
        commentId,
      },
    })
  }

  async findByUserAndComment(userId: string, commentId: string): Promise<Like | null> {
    const like = await this.prisma.like.findFirst({
      where: {
        userId,
        commentId,
      },
    })
    return like as Like | null
  }

  async countByComment(commentId: string): Promise<number> {
    return this.prisma.like.count({
      where: {
        commentId,
      },
    })
  }
}
