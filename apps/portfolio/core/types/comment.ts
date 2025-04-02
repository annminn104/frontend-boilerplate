import { z } from 'zod'

export const GetByPostIdSchema = z.object({
  postId: z.string(),
})

export const GetRepliesSchema = z.object({
  parentId: z.string(),
})

export const CreateCommentSchema = z.object({
  content: z.string().min(1, 'Content cannot be empty'),
  postId: z.string(),
  parentId: z.string().optional(),
})

export const UpdateCommentSchema = z.object({
  id: z.string(),
  content: z.string().min(1, 'Content cannot be empty'),
})

export const DeleteCommentSchema = z.object({
  id: z.string(),
})

export const ReportCommentSchema = z.object({
  id: z.string(),
})

export type GetByPostIdInput = z.infer<typeof GetByPostIdSchema>
export type GetRepliesInput = z.infer<typeof GetRepliesSchema>
export type CreateCommentInput = z.infer<typeof CreateCommentSchema>
export type UpdateCommentInput = z.infer<typeof UpdateCommentSchema>
export type DeleteCommentInput = z.infer<typeof DeleteCommentSchema>
export type ReportCommentInput = z.infer<typeof ReportCommentSchema>
