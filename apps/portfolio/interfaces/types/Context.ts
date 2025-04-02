import { PrismaClient } from '@prisma/client'
import { getAuth } from '@clerk/nextjs/server'

export interface Context {
  prisma: PrismaClient
  auth: ReturnType<typeof getAuth>
  userId?: string
}

export interface AuthenticatedContext extends Context {
  userId: string
}

export type RouterContext = {
  ctx: Context
}
