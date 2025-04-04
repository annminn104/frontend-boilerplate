import { initTRPC, TRPCError } from '@trpc/server'
import { Context, AuthenticatedContext } from '../interfaces/types/Context'
import { convertToTRPCError } from './errorAdapter'
import superjson from 'superjson'
import { ZodError } from 'zod'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        code: error.code,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const router = t.router
export const middleware = t.middleware

// Base procedure with error handling
const baseProcedure = t.procedure.use(
  middleware(async ({ next }) => {
    try {
      return await next()
    } catch (error) {
      throw convertToTRPCError(error)
    }
  })
)

// Public procedure - available to all users
export const publicProcedure = baseProcedure

// Auth middleware - ensures user is authenticated
const isAuthed = middleware(({ ctx, next }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in' })
  }
  return next({
    ctx: {
      ...ctx,
      auth: ctx.auth,
    } as AuthenticatedContext,
  })
})

// Protected procedure - only for authenticated users
export const protectedProcedure = baseProcedure.use(isAuthed)

// Owner middleware - ensures user is an owner
const isOwner = middleware(async ({ ctx, next }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in' })
  }

  const user = await ctx.prisma.user.findUnique({
    where: {
      id: ctx.auth.userId,
      role: 'OWNER',
    },
  })

  if (!user) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You must be an owner to perform this action',
    })
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.auth.userId,
    } as AuthenticatedContext,
  })
})

// Owner procedure - only for owner users
export const ownerProcedure = baseProcedure.use(isOwner)
