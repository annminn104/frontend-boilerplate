import { router } from '../trpc'
import { postRouter } from './post'
import { userRouter } from './user'
import { contactRouter } from './contact'
import { portfolioRouter } from './portfolio'
import { projectRouter } from './project'
import { commentRouter } from './comment'
import { analyticsRouter } from './analytics'
import { chatRouter } from './chat'
import { createLikeRouter } from '../../interfaces/adapters/LikeTRPCAdapter'
import { LikeUseCase } from '../../core/usecases/LikeUseCase'
import { PrismaLikeRepository } from '../../interfaces/adapters/PrismaLikeRepository'
import { PrismaCommentRepository } from '../../interfaces/adapters/PrismaCommentRepository'
import { prisma } from '../db'
import { likeRouter } from './like'

const likeRepository = new PrismaLikeRepository(prisma)
const commentRepository = new PrismaCommentRepository(prisma)
const likeUseCase = new LikeUseCase(likeRepository, commentRepository)

export const appRouter = router({
  post: postRouter,
  user: userRouter,
  contact: contactRouter,
  portfolio: portfolioRouter,
  project: projectRouter,
  comment: commentRouter,
  analytics: analyticsRouter,
  chat: chatRouter,
  like: likeRouter,
  createLike: createLikeRouter(likeUseCase),
})

export type AppRouter = typeof appRouter
