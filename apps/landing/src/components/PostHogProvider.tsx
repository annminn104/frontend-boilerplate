'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (posthog.__loaded) return

    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'

    if (apiKey) {
      posthog.init(apiKey, {
        api_host: apiHost,
        capture_pageview: false,
        loaded: () => {
          if (process.env.NODE_ENV === 'development') {
            posthog.debug()
          }
        },
      })
    } else {
      console.warn('PostHog API key is missing')
    }
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
