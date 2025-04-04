'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, loggerLink, wsLink, createWSClient, splitLink } from '@trpc/client'
import React, { useState } from 'react'
import { trpc } from '@/lib/trpc'
import superjson from 'superjson'
import { env } from '@/env'

export function TRPCProvider({ children, cookies }: { children: React.ReactNode; cookies: string }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: op => env.NODE_ENV === 'development' || (op.direction === 'down' && op.result instanceof Error),
        }),
        wsLink({
          client: createWSClient({
            url: env.NEXT_PUBLIC_WS_HOST + ':' + env.NEXT_PUBLIC_WS_PORT,
          }),
          transformer: superjson,
        }),
        splitLink({
          condition: op => op.type === 'subscription',
          true: wsLink({
            client: createWSClient({
              url: env.NEXT_PUBLIC_WS_HOST + ':' + env.NEXT_PUBLIC_WS_PORT,
            }),

            transformer: superjson,
          }),
          false: httpBatchLink({
            url: '/api/trpc',
            transformer: superjson,
            headers() {
              return {
                cookie: cookies,
                'x-trpc-source': 'react',
              }
            },
          }),
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
