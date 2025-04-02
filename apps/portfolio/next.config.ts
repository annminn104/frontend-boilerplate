// @ts-nocheck
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: process.env.NODE_ENV !== 'production',
  transpilePackages: ['@trpc/server', '@trpc/client', '@fe-boilerplate/ui', '@fe-boilerplate/core'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    swcTraceProfiling: true,
    serverActions: {
      allowedOrigins: ['*'],
      bodySizeLimit: '10mb',
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    })
    return config
  },
}

export default nextConfig
