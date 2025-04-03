import { Comment, CommentRepository } from '../entities/Comment'
import { UserRepository } from '../entities/User'
import { NotFoundError, UnauthorizedError, ForbiddenError } from '../errors/ApplicationError'
import { CommentResponse, CommentReplyResponse, SuccessResponse } from '../types/responses'

export interface CreateCommentDTO {
  content: string
  postId: string
  authorId: string
  parentId?: string
}

export interface UpdateCommentDTO {
  content: string
}

export class CommentUseCase {
  constructor(
    private commentRepository: CommentRepository,
    private userRepository: UserRepository
  ) {}

  async createComment(dto: CreateCommentDTO): Promise<CommentResponse | CommentReplyResponse> {
    const author = await this.userRepository.findById(dto.authorId)
    if (!author) {
      throw new NotFoundError('Author')
    }

    const comment = await this.commentRepository.create({
      content: dto.content,
      postId: dto.postId,
      authorId: dto.authorId,
      parentId: dto.parentId ?? null,
      isSpam: false,
      isReported: false,
    })

    return dto.parentId
      ? this.formatReplyResponse(comment, dto.authorId)
      : this.formatCommentResponse(comment, dto.authorId)
  }

  async updateComment(
    id: string,
    dto: UpdateCommentDTO,
    userId: string
  ): Promise<CommentResponse | CommentReplyResponse> {
    const comment = await this.commentRepository.findById(id)
    if (!comment) {
      throw new NotFoundError('Comment')
    }

    if (comment.authorId !== userId) {
      throw new UnauthorizedError('You can only update your own comments')
    }

    const updatedComment = await this.commentRepository.update(id, dto)
    return comment.parentId
      ? this.formatReplyResponse(updatedComment, userId)
      : this.formatCommentResponse(updatedComment, userId)
  }

  async deleteComment(id: string, userId: string): Promise<SuccessResponse> {
    const comment = await this.commentRepository.findById(id)
    if (!comment) {
      throw new NotFoundError('Comment')
    }

    if (comment.authorId !== userId) {
      throw new UnauthorizedError('You can only delete your own comments')
    }

    await this.commentRepository.delete(id)
    return { success: true }
  }

  async getCommentsByPostId(postId: string, userId?: string): Promise<CommentResponse[]> {
    const comments = await this.commentRepository.findByPostId(postId)
    return comments.map(comment => this.formatCommentResponse(comment, userId))
  }

  async getReplies(parentId: string, userId?: string): Promise<CommentReplyResponse[]> {
    const replies = await this.commentRepository.findReplies(parentId)
    return replies.map(reply => this.formatReplyResponse(reply, userId))
  }

  async reportComment(id: string, userId: string): Promise<CommentResponse | CommentReplyResponse> {
    const comment = await this.commentRepository.findById(id)
    if (!comment) {
      throw new NotFoundError('Comment')
    }

    if (comment.authorId === userId) {
      throw new ForbiddenError('You cannot report your own comment')
    }

    const reportedComment = await this.commentRepository.markAsReported(id)
    return comment.parentId
      ? this.formatReplyResponse(reportedComment, userId)
      : this.formatCommentResponse(reportedComment, userId)
  }

  private formatCommentResponse(comment: Comment, userId?: string): CommentResponse {
    return {
      id: comment.id,
      content: comment.content,
      postId: comment.postId,
      authorId: comment.authorId,
      parentId: comment.parentId,
      isSpam: comment.isSpam,
      isReported: comment.isReported,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: {
        id: comment.author.id,
        name: comment.author.name ?? 'Anonymous',
        email: comment.author.email,
        clerkId: comment.author.clerkId,
        avatar: comment.author.avatar,
      },
      post: {
        id: comment.post.id,
        title: comment.post.title,
      },
      _count: {
        likes: comment._count.likes,
        replies: comment._count.replies,
      },
      replies: comment.replies?.map(reply => this.formatReplyResponse(reply, userId)) || [],
      isAuthor: userId ? comment.authorId === userId : false,
      isLiked: userId ? comment.likes.some(like => like.userId === userId) : false,
      likes: comment._count.likes,
    }
  }

  private formatReplyResponse(reply: Comment, userId?: string): CommentReplyResponse {
    return {
      id: reply.id,
      content: reply.content,
      postId: reply.postId,
      authorId: reply.authorId,
      parentId: reply.parentId,
      isSpam: reply.isSpam,
      isReported: reply.isReported,
      createdAt: reply.createdAt,
      updatedAt: reply.updatedAt,
      author: {
        id: reply.author.id,
        name: reply.author.name ?? 'Anonymous',
        email: reply.author.email,
        clerkId: reply.author.clerkId,
        avatar: reply.author.avatar,
      },
      post: {
        id: reply.post.id,
        title: reply.post.title,
      },
      _count: {
        likes: reply._count.likes,
        replies: reply._count.replies,
      },
      likes: reply._count.likes,
      isAuthor: userId ? reply.authorId === userId : false,
      isLiked: userId ? reply.likes.some(like => like.userId === userId) : false,
    }
  }
}
