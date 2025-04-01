import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    WS_PORT: z.string().default('3001'),
  },
  client: {
    NEXT_PUBLIC_WS_HOST: z.string().default('localhost'),
    NEXT_PUBLIC_WS_PORT: z.string().default('3001'),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    WS_PORT: process.env.WS_PORT,
    NEXT_PUBLIC_WS_HOST: process.env.NEXT_PUBLIC_WS_HOST,
    NEXT_PUBLIC_WS_PORT: process.env.NEXT_PUBLIC_WS_PORT,
  },
})
