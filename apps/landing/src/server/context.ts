import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { type Session, getSession } from '@/lib/auth'

interface CreateContextOptions {
  session: Session | null
}

export async function createContext(_opts?: CreateNextContextOptions) {
  const session = await getSession()

  return {
    auth: session,
  }
}

export type Context = Awaited
