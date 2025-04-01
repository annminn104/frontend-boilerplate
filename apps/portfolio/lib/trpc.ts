'use client'

import { createTRPCReact } from '@trpc/react-query'
import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
import { createWSClient, wsLink } from '@trpc/client'
import superjson from 'superjson'
import type { AppRouter } from '@/server/routers/_app'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

const getWsUrl = () => {
  if (process.env.NEXT_PUBLIC_WS_URL) return process.env.NEXT_PUBLIC_WS_URL
  if (process.env.VERCEL_URL) return `wss://${process.env.VERCEL_URL}`
  return `ws://localhost:3001`
}

const wsClient = createWSClient({
  url: getWsUrl(),
})

export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: opts =>
        process.env.NODE_ENV === 'development' || (opts.direction === 'down' && opts.result instanceof Error),
    }),
    typeof window !== 'undefined'
      ? wsLink({
          client: wsClient,
          transformer: superjson,
        })
      : httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
        }),
  ],
})
