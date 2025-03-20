'use client'

import { useEffect, useState } from 'react'
import { usePostHog } from '../hooks/usePostHog'

export function PostHogDebug() {
  const posthog = usePostHog()
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      if (posthog) {
        setStatus('ready')
        console.log('PostHog đã sẵn sàng:', posthog)
      } else {
        setStatus('error')
        console.error('PostHog chưa được khởi tạo đúng cách')
      }
    }
  }, [posthog])

  if (process.env.NODE_ENV === 'production') return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        right: 10,
        padding: 10,
        background: '#f0f0f0',
        zIndex: 9999,
      }}
    >
      PostHog: {status === 'ready' ? '✅' : status === 'error' ? '❌' : '⏳'}
    </div>
  )
}
