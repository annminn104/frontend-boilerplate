'use client'

import { useEffect } from 'react'
import { usePostHog } from '../../hooks/usePostHog'

interface AuthWrapperProps {
  children: React.ReactNode
  userId?: string
  userProperties?: Record
}

export function AuthWrapper({ children, userId, userProperties }: AuthWrapperProps) {
  const posthog = usePostHog()

  useEffect(() => {
    if (posthog && userId) {
      // Xác định người dùng trong PostHog
      posthog.identify(userId, userProperties)
    }

    return () => {
      // Reset khi component unmount nếu cần
      if (posthog) {
        posthog.reset()
      }
    }
  }, [posthog, userId, userProperties])

  return <>{children}</>
}
