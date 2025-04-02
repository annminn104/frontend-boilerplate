export interface Like {
  id: string
  userId: string
  commentId: string
  createdAt: Date
}

export interface LikeRepository {
  create(userId: string, commentId: string): Promise<Like>
  delete(userId: string, commentId: string): Promise<void>
  findByUserAndComment(userId: string, commentId: string): Promise<Like | null>
  countByComment(commentId: string): Promise<number>
}
