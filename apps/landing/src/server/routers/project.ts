import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { SupabaseProjectRepository } from '@/infrastructure/repositories/prisma-project-repository'

const projectRepository = new SupabaseProjectRepository()

// Define input schema for list projects
const listProjectsSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(10),
  tag: z.string().optional(),
  search: z.string().optional(),
})

export const projectRouter = router({
  list: publicProcedure.input(listProjectsSchema).query(async ({ input }) => {
    return projectRepository.findMany({
      limit: input.limit,
      cursor: input.cursor,
      tag: input.tag,
    })
  }),

  byId: publicProcedure.input(z.string()).query(async ({ input }) => {
    return projectRepository.findById(input)
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        image: z.string().url().optional(),
        url: z.string().url().optional(),
        github: z.string().url().optional(),
        tags: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Create an internal type that includes authorId
      type InternalCreateProjectDTO = typeof input & { authorId: string }

      return projectRepository.create({
        ...input,
        authorId: ctx.auth.userId,
      } as InternalCreateProjectDTO)
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        image: z.string().url().optional(),
        url: z.string().url().optional(),
        github: z.string().url().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      return projectRepository.update(input)
    }),

  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    return projectRepository.delete(input)
  }),
})
