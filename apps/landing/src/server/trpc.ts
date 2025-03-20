import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { TRPCError } from '@trpc/server'
import { type Context } from './context'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure

// Create a middleware that checks for auth
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.auth?.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: {
      auth: ctx.auth,
    },
  })
})

export const protectedProcedure = t.procedure.use(isAuthed)
export const middleware = t.middleware
