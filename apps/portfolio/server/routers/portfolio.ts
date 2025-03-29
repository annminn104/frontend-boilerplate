import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { sectionTypes } from '@/lib/validations/portfolio'
import { TRPCError } from '@trpc/server'

const sectionTypeEnum = z.enum(['introduction', 'techStack', 'workExperience', 'projects', 'contact'])

const portfolioInputSchema = z.object({
  type: sectionTypeEnum,
  title: z.string(),
  content: z.any(), // Make content required
  order: z.number().optional().default(0),
})

export const portfolioRouter = router({
  // Get all sections
  getAllSections: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.portfolioSection.findMany({
        orderBy: { order: 'asc' },
      })
    } catch (error) {
      console.error('Error in getAllSections:', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch sections',
      })
    }
  }),

  // Get section by type
  getSection: publicProcedure.input(sectionTypeEnum).query(async ({ ctx, input }) => {
    try {
      const section = await ctx.prisma.portfolioSection.findFirst({
        where: { type: input },
      })

      if (!section) {
        // Return default content if no section exists
        return {
          type: input,
          title: 'Default Title',
          content: {}, // Provide default empty content
          order: 0,
        }
      }

      return section
    } catch (error) {
      console.error('Error in getSection:', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch section',
      })
    }
  }),

  // Create or update section (protected, owner only)
  upsertSection: protectedProcedure.input(portfolioInputSchema).mutation(async ({ ctx, input }) => {
    try {
      if (ctx.auth.userId !== process.env.NEXT_PUBLIC_OWNER_USER_ID) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only the owner can modify portfolio sections',
        })
      }

      return await ctx.prisma.portfolioSection.upsert({
        where: { type: input.type },
        update: {
          title: input.title,
          content: input.content,
          order: input.order,
        },
        create: {
          type: input.type,
          title: input.title,
          content: input.content || {}, // Provide default empty content
          order: input.order || 0,
        },
      })
    } catch (error) {
      console.error('Error in upsertSection:', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update section',
      })
    }
  }),

  // Delete section (protected, owner only)
  deleteSection: protectedProcedure.input(z.enum(sectionTypes)).mutation(async ({ ctx, input }) => {
    if (ctx.auth.userId !== process.env.NEXT_PUBLIC_OWNER_USER_ID) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only the owner can delete portfolio sections',
      })
    }

    return await ctx.prisma.portfolioSection.delete({
      where: { type: input },
    })
  }),

  updateSection: publicProcedure
    .input(
      z.object({
        type: sectionTypeEnum,
        title: z.string(),
        content: z.any(), // You might want to be more specific based on section type
        order: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.portfolioSection.upsert({
        where: { type: input.type },
        update: input,
        create: {
          ...input,
          content: input.content || {},
          order: input.order ?? 0,
        },
      })
    }),
})
