import { router } from '../trpc'
import { projectRouter } from './project'
import { postRouter } from './post'

export const appRouter = router({
  project: projectRouter,
  post: postRouter,
})

export type AppRouter = typeof appRouter
