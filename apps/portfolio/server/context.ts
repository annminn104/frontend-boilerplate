import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function createContext({ req }: { req: Request }) {
  console.info('createContext', req)

  return {
    prisma,
    auth: await auth(),
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
