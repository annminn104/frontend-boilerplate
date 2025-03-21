import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '../lib/prisma'
import { type NextRequest } from 'next/server'

interface CreateContextOptions {
  req: NextRequest
  res?: Response
}

export async function createContext({ req }: CreateContextOptions) {
  const auth = getAuth(req)

  return {
    prisma,
    auth,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
