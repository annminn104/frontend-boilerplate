import { initTRPC, TRPCError } from '@trpc/server'
import { Context, AuthenticatedContext } from '../interfaces/types/Context'
import { convertToTRPCError } from './errorAdapter'
import superjson from 'superjson'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        code: error.code,
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
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in' })
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    } as AuthenticatedContext,
  })
})

// Protected procedure - only for authenticated users
export const protectedProcedure = baseProcedure.use(isAuthed)

// Owner middleware - ensures user is an owner
const isOwner = middleware(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in' })
  }

  const user = await ctx.prisma.user.findFirst({
    where: {
      id: ctx.userId,
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
      userId: ctx.userId,
    } as AuthenticatedContext,
  })
})

// Owner procedure - only for owner users
export const ownerProcedure = baseProcedure.use(isOwner)
