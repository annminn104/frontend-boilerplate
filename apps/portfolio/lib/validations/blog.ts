import { z } from 'zod'

export const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  published: z.boolean().default(false),
})

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
})

export type Post = z.infer<typeof postSchema>
export type Comment = z.infer<typeof commentSchema>
