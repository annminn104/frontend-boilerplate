import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import {
  sectionTypes,
  portfolioSectionSchema,
  introductionSchema,
  techStackSchema,
  workExperienceSchema,
} from '@/lib/validations/portfolio'

// Utility Types
type SectionType = (typeof sectionTypes)[number]

// Content Validation Schemas
const projectsSchema = z.object({
  projects: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      image: z.string(),
      technologies: z.array(z.string()),
    })
  ),
})

const contactSchema = z.object({
  email: z.string().email(),
  socialLinks: z.array(
    z.object({
      platform: z.string(),
      url: z.string().url(),
    })
  ),
})

// Type definitions for each section's content
type IntroductionContent = z.infer<typeof introductionSchema>
type TechStackContent = z.infer<typeof techStackSchema>
type WorkExperienceContent = z.infer<typeof workExperienceSchema>
type ProjectsContent = z.infer<typeof projectsSchema>
type ContactContent = z.infer<typeof contactSchema>

interface PortfolioSection {
  id: string
  type: SectionType
  title: string
  content: IntroductionContent | TechStackContent | WorkExperienceContent | ProjectsContent | ContactContent
  order: number
  createdAt: Date
  updatedAt: Date
}

// Input Schemas
const portfolioInputSchema = portfolioSectionSchema.extend({
  content: z.union([introductionSchema, techStackSchema, workExperienceSchema, projectsSchema, contactSchema]),
})

// Utility Functions
const getDefaultContent = (type: SectionType): PortfolioSection['content'] => {
  switch (type) {
    case 'introduction':
      return { headline: '', subheadline: '', description: '' }
    case 'techStack':
      return { technologies: [] }
    case 'workExperience':
      return { experiences: [] }
    case 'projects':
      return { projects: [] }
    case 'contact':
      return { email: '', socialLinks: [] }
  }
}

const createDefaultSection = (type: SectionType): PortfolioSection => ({
  id: `default-${type}`,
  type,
  title: type.charAt(0).toUpperCase() + type.slice(1),
  content: getDefaultContent(type),
  order: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const validateOwnership = (userId: string | null) => {
  if (userId !== process.env.NEXT_PUBLIC_OWNER_USER_ID) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Only the owner can modify portfolio sections',
    })
  }
}

export const portfolioRouter = router({
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

  getSection: publicProcedure.input(z.enum(sectionTypes)).query(async ({ ctx, input: type }) => {
    try {
      const section = await ctx.prisma.portfolioSection.findFirst({
        where: { type },
      })

      if (!section) {
        return createDefaultSection(type)
      }

      const content = typeof section.content === 'string' ? JSON.parse(section.content) : section.content

      return {
        ...section,
        content: content || getDefaultContent(type),
      }
    } catch (error) {
      console.error('Error in getSection:', error)
      return createDefaultSection(type)
    }
  }),

  upsertSection: protectedProcedure.input(portfolioInputSchema).mutation(async ({ ctx, input }) => {
    try {
      validateOwnership(ctx.auth.userId)

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
          content: input.content,
          order: input.order,
        },
      })
    } catch (error) {
      if (error instanceof TRPCError) throw error
      console.error('Error in upsertSection:', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update section',
      })
    }
  }),

  deleteSection: protectedProcedure.input(z.enum(sectionTypes)).mutation(async ({ ctx, input }) => {
    try {
      validateOwnership(ctx.auth.userId)
      return await ctx.prisma.portfolioSection.delete({
        where: { type: input },
      })
    } catch (error) {
      if (error instanceof TRPCError) throw error
      console.error('Error in deleteSection:', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete section',
      })
    }
  }),
})
