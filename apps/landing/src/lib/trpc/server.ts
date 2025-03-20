import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

const t = initTRPC.create({
  transformer: superjson,
})

export const router = t.router
export const procedure = t.procedure

// Define an empty router
export const appRouter = router({
  // Define your procedures here
})

// Export the router type
export type Router = typeof appRouter
