import { z } from 'zod'

export const sectionTypes = ['introduction', 'techStack', 'workExperience', 'projects', 'contact'] as const

export const portfolioSectionSchema = z.object({
  type: z.enum(sectionTypes),
  title: z.string().min(1, 'Title is required'),
  content: z.any(), // Will be validated based on section type
  order: z.number().int().min(0),
})

// Type-specific content schemas
export const introductionSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  description: z.string(),
})

export const techStackSchema = z.object({
  technologies: z.array(
    z.object({
      name: z.string(),
      icon: z.string(),
      proficiency: z.number().min(0).max(100),
    })
  ),
})

export const workExperienceSchema = z.object({
  experiences: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      period: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
    })
  ),
})

export type PortfolioSection = z.infer<typeof portfolioSectionSchema>
