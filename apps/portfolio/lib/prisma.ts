import { PrismaClient } from '@prisma/client'

import { env } from '@/env'

// Add prisma to the global type
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Instantiate prisma client
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

// If we're not in production, set the prisma global
if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
