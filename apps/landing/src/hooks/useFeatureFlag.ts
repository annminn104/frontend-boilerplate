'use client'

import { useEffect, useState } from 'react'
import { usePostHog } from './usePostHog'

/**
 * Hook để sử dụng Feature Flags từ PostHog
 */
export function useFeatureFlag(flagKey: string, defaultValue: boolean = false) {
  const posthog = usePostHog()
  const [isEnabled, setIsEnabled] = useState<boolean>(defaultValue)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!posthog) {
      setIsLoading(false)
      return
    }

    // Kiểm tra giá trị của feature flag
    const checkFlag = () => {
      const enabled = posthog.isFeatureEnabled(flagKey)
      setIsEnabled(enabled ?? defaultValue)
      setIsLoading(false)
    }

    // Kiểm tra ngay khi component mount
    checkFlag()

    // Lắng nghe thay đổi từ PostHog
    const unsubscribe = posthog.onFeatureFlags(checkFlag)

    // Cleanup listener
    return () => {
      // Use the returned unsubscribe function instead of removeEventListener
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    }
  }, [posthog, flagKey, defaultValue])

  return { isEnabled, isLoading }
}
