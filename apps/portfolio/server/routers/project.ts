import { z } from 'zod'
import { router, publicProcedure, protectedProcedure, ownerProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'

// Project input validation schema
const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  content: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
  demoUrl: z.string().url().optional().nullable(),
  githubUrl: z.string().url().optional().nullable(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  order: z.number().default(0),
})

export const projectRouter = router({
  // Get all published projects
  getAllPublished: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.project.findMany({
      where: { published: true },
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    })
  }),

  // Get all projects (for admin)
  getAll: ownerProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.project.findMany({
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    })
  }),

  // Get project by ID
  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const project = await ctx.prisma.project.findUnique({
      where: { id: input },
    })

    if (!project) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' })
    }

    // If project is not published, only allow owner to view it
    if (!project.published) {
      // If no user is logged in, they can't view unpublished projects
      if (!ctx.auth?.userId) {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Project is not published' })
      }

      // (owner)
      const owner = await ctx.prisma.user.findUnique({
        where: {
          clerkId: ctx.auth.userId,
          role: 'OWNER',
        },
      })

      // Get the current user if logged in
      const userId = ctx.auth.userId

      if (userId) {
        const currentUser = await ctx.prisma.user.findUnique({
          where: { clerkId: userId },
        })

        // If current user is the owner, allow access
        if (currentUser && owner && currentUser.id === owner.id) {
          return project
        }
      }

      // Otherwise deny access
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Project is not published' })
    }

    return project
  }),

  // Create a new project
  create: ownerProcedure.input(projectSchema).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.project.create({
      data: input,
    })
  }),

  // Update a project
  update: ownerProcedure
    .input(
      z.object({
        id: z.string(),
        data: projectSchema.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.id },
      })

      if (!project) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' })
      }

      return await ctx.prisma.project.update({
        where: { id: input.id },
        data: input.data,
      })
    }),

  // Delete a project
  delete: ownerProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const project = await ctx.prisma.project.findUnique({
      where: { id: input },
    })

    if (!project) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' })
    }

    return await ctx.prisma.project.delete({
      where: { id: input },
    })
  }),

  // Reorder projects
  reorder: ownerProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          order: z.number(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      // Update each project's order in a transaction
      await ctx.prisma.$transaction(
        input.map(item =>
          ctx.prisma.project.update({
            where: { id: item.id },
            data: { order: item.order },
          })
        )
      )

      return { success: true }
    }),
})
