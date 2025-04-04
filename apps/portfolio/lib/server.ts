import 'server-only'

import { cache } from 'react'
import { cookies } from 'next/headers'
import { appRouter, type AppRouter } from '@/server/routers/_app'
import { createTRPCContext } from '@/server/context'
import { loggerLink, TRPCClientError } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import { transformer } from './shared'
import { observable } from '@trpc/server/observable'
import { callProcedure, TRPCErrorResponse } from '@trpc/server/unstable-core-do-not-import'

const createContext = cache(() => {
  return createTRPCContext({
    headers: new Headers({
      cookie: cookies().toString(),
      'x-trpc-source': 'rsc',
    }),
  })
})

export const api = createTRPCNext<AppRouter>({
  config(opts) {
    return {
      ...opts,
      transformer,
      links: [
        loggerLink({
          enabled: op =>
            process.env.NODE_ENV === 'development' || (op.direction === 'down' && op.result instanceof Error),
        }),
        () =>
          ({ op }) =>
            observable(observer => {
              createContext()
                .then(ctx => {
                  return callProcedure({
                    procedures: appRouter._def.procedures,
                    path: op.path,
                    rawInput: op.input,
                    ctx,
                    type: op.type,
                  })
                })
                .then(data => {
                  observer.next({ result: { data } })
                  observer.complete()
                })
                .catch((cause: TRPCErrorResponse) => {
                  observer.error(TRPCClientError.from(cause))
                })
            }),
      ],
    }
  },
  transformer,
})
