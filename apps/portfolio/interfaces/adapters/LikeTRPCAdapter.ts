import { router, protectedProcedure } from '../../server/trpc'
import { LikeUseCase } from '../../core/usecases/LikeUseCase'
import { z } from 'zod'

const LikeCommentSchema = z.object({
  commentId: z.string(),
})

type LikeCommentInput = z.infer<typeof LikeCommentSchema>

export const createLikeRouter = (likeUseCase: LikeUseCase) => {
  return router({
    like: protectedProcedure.input(LikeCommentSchema).mutation(async ({ input, ctx }) => {
      return likeUseCase.likeComment(input.commentId, ctx.auth.userId!)
    }),

    unlike: protectedProcedure.input(LikeCommentSchema).mutation(async ({ input, ctx }) => {
      return likeUseCase.unlikeComment(input.commentId, ctx.auth.userId!)
    }),

    getLikeCount: protectedProcedure.input(LikeCommentSchema).query(async ({ input }) => {
      return likeUseCase.getLikeCount(input.commentId)
    }),

    isLiked: protectedProcedure.input(LikeCommentSchema).query(async ({ input, ctx }) => {
      return likeUseCase.isLikedByUser(input.commentId, ctx.auth.userId!)
    }),
  })
}
