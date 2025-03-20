'use client'

import { ReactNode, memo } from 'react'
import { useFeatureFlag } from '../hooks/useFeatureFlag'

interface FeatureFlagProps {
  flagKey: string
  defaultValue?: boolean
  children: ReactNode
  fallback?: ReactNode
}

export const FeatureFlag = memo(function FeatureFlag({
  flagKey,
  defaultValue = false,
  children,
  fallback = null,
}: FeatureFlagProps) {
  const { isEnabled, isLoading } = useFeatureFlag(flagKey, defaultValue)

  if (isLoading) return null

  return isEnabled ? <>{children}</> : <>{fallback}</>
})
