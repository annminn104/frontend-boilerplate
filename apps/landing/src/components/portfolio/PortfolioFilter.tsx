'use client'

import { useState } from 'react'
import { usePostHogEvent } from '../../hooks/usePostHog'

export function PortfolioFilter() {
  const { capture } = usePostHogEvent()
  const [activeFilter, setActiveFilter] = useState('all')

  const filters = [
    { id: 'all', name: 'All Projects' },
    { id: 'web', name: 'Web Development' },
    { id: 'mobile', name: 'Mobile Apps' },
    { id: 'design', name: 'UI/UX Design' },
    { id: 'branding', name: 'Branding' },
  ]

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId)
    capture('portfolio_filter_changed', { filter: filterId })

    // Dispatch a custom event that PortfolioGrid will listen for
    const event = new CustomEvent('portfolio-filter-changed', {
      detail: { filter: filterId },
    })
    window.dispatchEvent(event)
  }

  return (
    <div className="mb-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-extrabold text-gray-900">Our Projects</h2>

        <div className="mt-4 sm:mt-0">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterChange(filter.id)}
                className={`rounded-md px-4 py-2 text-sm font-medium ${
                  activeFilter === filter.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
