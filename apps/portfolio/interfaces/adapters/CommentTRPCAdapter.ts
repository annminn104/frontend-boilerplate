import { router, publicProcedure, protectedProcedure } from '../../server/trpc'
import { CommentUseCase } from '../../core/usecases/CommentUseCase'
import {
  GetByPostIdSchema,
  GetRepliesSchema,
  CreateCommentSchema,
  UpdateCommentSchema,
  DeleteCommentSchema,
  ReportCommentSchema,
  GetByPostIdInput,
  GetRepliesInput,
  CreateCommentInput,
  UpdateCommentInput,
  DeleteCommentInput,
  ReportCommentInput,
} from '../../core/types/comment'
import { RouterContext } from '../types/Context'

export const createCommentRouter = (commentUseCase: CommentUseCase) => {
  return router({
    getByPostId: publicProcedure.input(GetByPostIdSchema).query(async ({ input }: { input: GetByPostIdInput }) => {
      return commentUseCase.getCommentsByPostId(input.postId)
    }),

    getReplies: publicProcedure.input(GetRepliesSchema).query(async ({ input }: { input: GetRepliesInput }) => {
      return commentUseCase.getReplies(input.parentId)
    }),

    create: protectedProcedure
      .input(CreateCommentSchema)
      .mutation(async ({ input, ctx }: RouterContext & { input: CreateCommentInput }) => {
        return commentUseCase.createComment({
          ...input,
          authorId: ctx.userId!,
        })
      }),

    update: protectedProcedure
      .input(UpdateCommentSchema)
      .mutation(async ({ input, ctx }: RouterContext & { input: UpdateCommentInput }) => {
        return commentUseCase.updateComment(input.id, { content: input.content }, ctx.userId!)
      }),

    delete: protectedProcedure
      .input(DeleteCommentSchema)
      .mutation(async ({ input, ctx }: RouterContext & { input: DeleteCommentInput }) => {
        await commentUseCase.deleteComment(input.id, ctx.userId!)
        return { success: true }
      }),

    report: protectedProcedure
      .input(ReportCommentSchema)
      .mutation(async ({ input, ctx }: RouterContext & { input: ReportCommentInput }) => {
        return commentUseCase.reportComment(input.id, ctx.userId!)
      }),
  })
}
