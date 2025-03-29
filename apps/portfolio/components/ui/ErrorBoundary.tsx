'use client'

import { useEffect } from 'react'

interface ErrorBoundaryProps {
  error: Error
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <button onClick={reset} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
        Try again
      </button>
    </div>
  )
}
