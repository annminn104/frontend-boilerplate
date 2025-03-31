import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

let prisma = globalThis.prisma ?? prismaClientSingleton()

if (typeof window === 'undefined') {
  if (process.env.NODE_ENV === 'production') {
    prisma = prismaClientSingleton()
  } else {
    if (!global.prisma) {
      global.prisma = prismaClientSingleton()
    }
  }
}

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export default prisma
