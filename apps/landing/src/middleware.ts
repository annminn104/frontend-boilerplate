import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware({})

export const config = {
  publicRoutes: ['/', '/blog', '/blog/(.*)', '/api/trpc/(.*)'],
  ignoredRoutes: ['/api/trpc/(.*)'],
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)', '!/(api|trpc)/webhooks/clerk(.*)'],
}
