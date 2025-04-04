import { auth } from '@clerk/nextjs/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { type NodeHTTPCreateContextFnOptions } from '@trpc/server/adapters/node-http'
import { prisma } from '@/lib/prisma'
import { type IncomingMessage } from 'http'
import type ws from 'ws'

export async function createTRPCContext(
  opts: { headers: Headers } | CreateNextContextOptions | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
) {
  return {
    prisma,
    auth: await auth(),
  }
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>
