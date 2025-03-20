'use client'

import { cn } from '@/lib/utils'
import NextImage, { ImageProps as NextImageProps } from 'next/image'
import { useState } from 'react'

interface ImageProps extends NextImageProps {
  wrapperClassName?: string
}

export function Image({ wrapperClassName, className, alt, ...props }: ImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  return (
    <div className={cn('overflow-hidden', wrapperClassName)}>
      {(isLoading || isError) && (
        <div
          className={cn('animate-pulse bg-muted', className)}
          style={{
            width: typeof props.width === 'number' ? `${props.width}px` : props.width,
            height: typeof props.height === 'number' ? `${props.height}px` : props.height,
          }}
        />
      )}
      <NextImage
        className={cn(
          className,
          'transition-opacity duration-300',
          isLoading || isError ? 'opacity-0' : 'opacity-100'
        )}
        alt={alt}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setIsError(true)
        }}
        {...props}
      />
    </div>
  )
}
