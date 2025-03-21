import { router } from '../trpc'
import { postRouter } from './post'
import { portfolioRouter } from './portfolio'
import { userRouter } from './user'

export const appRouter = router({
  post: postRouter,
  portfolio: portfolioRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter
