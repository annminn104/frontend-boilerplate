import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware({})

export const config = {
  publicRoutes: ['/', '/blog', '/blog/(.*)', '/api/trpc/(.*)'],
  ignoredRoutes: ['/api/trpc/(.*)', '/api/webhooks/clerk(.*)'],
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)', // exclude static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/', // include root
    '/api/:path*', // include api routes
    '/blog/:path*', // include blog routes
  ],
}
