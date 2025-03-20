import { clerkMiddleware, auth } from '@clerk/nextjs/server'

export default clerkMiddleware({})

export const config = {
  publicRoutes: ['/', '/about', '/blog', '/contact', '/api/trpc/(.*)'],
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}

export async function getSession() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  return {
    userId,
  }
}

export type Session = Awaited
