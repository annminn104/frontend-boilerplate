import { z } from 'zod'

// Input validation schema
export const projectFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().url().optional(),
  url: z.string().url().optional(),
  github: z.string().url().optional(),
  tags: z.array(z.string()),
})

// API validation schema
export const projectSchema = projectFormSchema.extend({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export type ProjectFormData = z.input
export type ProjectFormValues = z.output
export type ProjectData = z.infer
