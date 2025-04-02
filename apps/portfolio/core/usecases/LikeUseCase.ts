import { LikeRepository } from '../entities/Like'
import { CommentRepository } from '../entities/Comment'
import { NotFoundError, ForbiddenError } from '../errors/ApplicationError'
import { SuccessResponse } from '../types/responses'

export class LikeUseCase {
  constructor(
    private likeRepository: LikeRepository,
    private commentRepository: CommentRepository
  ) {}

  async likeComment(commentId: string, userId: string): Promise<SuccessResponse> {
    const comment = await this.commentRepository.findById(commentId)
    if (!comment) {
      throw new NotFoundError('Comment')
    }

    if (comment.isSpam || comment.isReported) {
      throw new ForbiddenError('Cannot like a spam or reported comment')
    }

    const existingLike = await this.likeRepository.findByUserAndComment(userId, commentId)
    if (existingLike) {
      throw new ForbiddenError('Comment already liked')
    }

    await this.likeRepository.create(userId, commentId)
    return { success: true }
  }

  async unlikeComment(commentId: string, userId: string): Promise<SuccessResponse> {
    const comment = await this.commentRepository.findById(commentId)
    if (!comment) {
      throw new NotFoundError('Comment')
    }

    const existingLike = await this.likeRepository.findByUserAndComment(userId, commentId)
    if (!existingLike) {
      throw new NotFoundError('Like')
    }

    await this.likeRepository.delete(userId, commentId)
    return { success: true }
  }

  async getLikeCount(commentId: string): Promise<number> {
    const comment = await this.commentRepository.findById(commentId)
    if (!comment) {
      throw new NotFoundError('Comment')
    }

    return this.likeRepository.countByComment(commentId)
  }

  async isLikedByUser(commentId: string, userId: string): Promise<boolean> {
    const comment = await this.commentRepository.findById(commentId)
    if (!comment) {
      throw new NotFoundError('Comment')
    }

    const like = await this.likeRepository.findByUserAndComment(userId, commentId)
    return !!like
  }
}
