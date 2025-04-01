import { router } from '../trpc'
import { postRouter } from './post'
import { userRouter } from './user'
import { contactRouter } from './contact'
import { portfolioRouter } from './portfolio'
import { projectRouter } from './project'
import { commentRouter } from './comment'
import { analyticsRouter } from './analytics'

export const appRouter = router({
  post: postRouter,
  user: userRouter,
  contact: contactRouter,
  portfolio: portfolioRouter,
  project: projectRouter,
  comment: commentRouter,
  analytics: analyticsRouter,
})

export type AppRouter = typeof appRouter
