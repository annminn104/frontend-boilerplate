import { PrismaClient } from '@prisma/client'
import { getAuth } from '@clerk/nextjs/server'

export interface Context {
  prisma: PrismaClient
  auth: ReturnType<typeof getAuth>
}

export interface AuthenticatedContext extends Context {}

export type RouterContext = {
  ctx: Context
}
