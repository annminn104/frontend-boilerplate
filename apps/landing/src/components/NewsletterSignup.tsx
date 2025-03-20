'use client'

import { useState } from 'react'
import { usePostHogEvent } from '../hooks/usePostHog'
import { subscribeToNewsletter } from '@/services/newsletter-service'

export function NewsletterSignup() {
  const { capture } = usePostHogEvent()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError('Please enter your email address')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const response = await subscribeToNewsletter({ email })

      if (response.success) {
        capture('newsletter_signup', { email })
        setIsSuccess(true)
        setEmail('')
      } else {
        throw new Error(response.message || 'Failed to subscribe')
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred. Please try again later.'
      setError(errorMessage)
      console.error('Newsletter signup error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-lg bg-white px-4 py-6 shadow-md sm:px-6 lg:px-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Subscribe to our newsletter</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get the latest news, updates and special offers.
        </p>
      </div>

      {isSuccess ? (
        <div className="mt-4 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Successfully subscribed! Thank you for subscribing to our newsletter.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex flex-col sm:flex-row">
            <input
              type="email"
              name="email"
              id="email"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:w-64 sm:text-sm"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className="mt-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 sm:ml-3 sm:mt-0"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Subscribe'}
            </button>
          </div>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          <p className="mt-3 text-xs text-gray-500">
            We respect your privacy. You can unsubscribe at any time.
          </p>
        </form>
      )}
    </div>
  )
}
