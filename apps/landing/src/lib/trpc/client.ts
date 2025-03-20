import { createTRPCReact } from '@trpc/react-query'
import type { Router } from './server'

// Export type to be used on the client side
export type AppRouter = Router
export const trpc = createTRPCReact<AppRouter>()
