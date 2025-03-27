import { type NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@trpc/server', '@trpc/client', '@fe-boilerplate/ui', '@fe-boilerplate/core'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    swcTraceProfiling: true,
    serverActions: {
      allowedOrigins: ['*'],
      bodySizeLimit: '10mb',
    },
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
      '@fe-boilerplate/ui': path.join(__dirname, '../../packages/ui/src'),
      '@fe-boilerplate/core': path.join(__dirname, '../../packages/core/src'),
    }
    return config
  },
}

export default nextConfig
