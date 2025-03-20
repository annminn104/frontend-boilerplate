import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { SupabasePostStorage } from '@/infrastructure/adapters/supabase-post-storage'

const postStorage = new SupabasePostStorage()

export const postRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional(),
        cursor: z.string().optional(),
        tag: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return postStorage.findMany(input)
    }),

  bySlug: publicProcedure.input(z.string()).query(async ({ input }) => {
    return postStorage.findBySlug(input)
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        excerpt: z.string().optional(),
        image: z.string().url().optional(),
        tags: z.array(z.string()),
        published: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return postStorage.create({
        ...input,
        authorId: ctx.auth.userId!,
      })
    }),
})
