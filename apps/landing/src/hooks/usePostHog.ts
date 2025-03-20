'use client'

import posthog from 'posthog-js'
import { useEffect, useState } from 'react'

export function usePostHog() {
  const [instance, setInstance] = useState<typeof posthog | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (posthog.__loaded) {
      setInstance(posthog)
      return
    }

    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'

    if (apiKey) {
      posthog.init(apiKey, {
        api_host: apiHost,
        capture_pageview: true,
        loaded: (ph) => {
          setInstance(ph)
        },
      })
    } else {
      console.warn('PostHog API key is missing')
    }
  }, [])

  return instance
}

export function usePostHogEvent() {
  const posthog = usePostHog()

  const capture = (eventName: string, properties?: Record) => {
    if (posthog) {
      posthog.capture(eventName, properties)
    }
  }

  return { capture }
}
