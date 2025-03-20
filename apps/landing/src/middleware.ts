import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware({})

export const config = {
  // Public routes that don't require authentication
  publicRoutes: ['/', '/projects', '/api/trpc/project.list', '/api/trpc/project.byId'],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: ['/api/health', '/_next/static/(.*)', '/favicon.ico'],
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
