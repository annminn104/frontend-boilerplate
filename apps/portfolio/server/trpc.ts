import { initTRPC, TRPCError } from '@trpc/server'
import { type Context } from './context'
import { ZodError } from 'zod'
import { transformer } from '@/lib/utils'

const t = initTRPC.context<Context>().create({
  transformer,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

// Middleware to check if user is authenticated
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      auth: ctx.auth,
    },
  })
})

// Middleware to check if user has OWNER role
const isOwner = t.middleware(async ({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  const owner = await ctx.prisma.user.findUnique({
    where: {
      clerkId: ctx.auth.userId,
      role: 'OWNER',
    },
  })

  // Check if current user is the first user (owner)
  const currentUser = await ctx.prisma.user.findUnique({
    where: { clerkId: ctx.auth.userId },
  })

  if (!currentUser || !owner || currentUser.id !== owner.id) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'You must be an owner to perform this action' })
  }

  return next({
    ctx: {
      auth: ctx.auth,
    },
  })
})

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuthed)
export const ownerProcedure = t.procedure.use(isOwner)
