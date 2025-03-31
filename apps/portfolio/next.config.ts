// @ts-nocheck
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: process.env.NODE_ENV !== 'production',
  transpilePackages: ['@trpc/server', '@trpc/client', '@fe-boilerplate/ui', '@fe-boilerplate/core'],
  compiler: {
    // removeConsole: process.env.NODE_ENV === 'production',
  },

  experimental: {
    swcTraceProfiling: true,
    serverComponentsExternalPackages: ['prisma', '@prisma/client'],
    serverActions: {
      allowedOrigins: ['*'],
      bodySizeLimit: '10mb',
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },
}

export default nextConfig
