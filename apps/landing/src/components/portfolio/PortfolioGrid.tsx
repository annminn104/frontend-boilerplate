'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePostHogEvent } from '@/hooks/usePostHog'
import type { PortfolioItem } from '@/types/portfolio'
import { getPortfolioItems, getPortfolioItemsByCategory } from '@/services/portfolio-service'

interface FilterChangeEvent extends CustomEvent {
  detail: {
    filter: string
  }
}

export function PortfolioGrid() {
  const { capture } = usePostHogEvent()
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getPortfolioItems()
        setPortfolioItems(data)
        setFilteredItems(data)
      } catch (err) {
        console.error('Error fetching portfolio items:', err)
        setError('Failed to load portfolio items. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPortfolioItems()

    const handleFilterChange = async (event: FilterChangeEvent) => {
      const { filter } = event.detail
      setActiveFilter(filter)

      try {
        setIsLoading(true)
        if (filter === 'all') {
          setFilteredItems(portfolioItems)
        } else {
          const items = await getPortfolioItemsByCategory(filter)
          setFilteredItems(items)
        }
      } catch (err) {
        console.error('Error filtering portfolio items:', err)
        setError('Failed to filter items. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    window.addEventListener(
      'portfolio-filter-changed',
      handleFilterChange as unknown as EventListener
    )

    return () => {
      window.removeEventListener(
        'portfolio-filter-changed',
        handleFilterChange as unknown as EventListener
      )
    }
  }, [portfolioItems])

  const handleItemClick = (item: PortfolioItem) => {
    capture('portfolio_item_clicked', {
      item_id: item.id,
      item_title: item.title,
      category: item.category,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">{error}</p>
        <button
          className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    )
  }

  if (filteredItems.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No projects found in this category.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {filteredItems.map((item) => (
        <Link
          href={`/portfolio/${item.slug}`}
          key={item.id}
          onClick={() => handleItemClick(item)}
          className="group"
        >
          <div className="overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl">
            <div className="relative h-48 overflow-hidden bg-gray-200">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-gray-500">
                  {item.title.charAt(0)}
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-indigo-600">
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(item.completionDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
              <h3 className="mt-2 text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-indigo-600">
                {item.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-gray-500">{item.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.technologies.slice(0, 3).map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800"
                  >
                    {tech}
                  </span>
                ))}
                {item.technologies.length > 3 && (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    +{item.technologies.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
