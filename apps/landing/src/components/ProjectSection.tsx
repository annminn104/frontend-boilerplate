'use client'

import { useEffect, useRef, useState } from 'react'
import useProjectStore from '@/store/use-project-store'
import type { Project } from '@/domain/entities'

export function ProjectSection() {
  const { projects, setProjects } = useProjectStore()
  const hasInitialized = useRef(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!hasInitialized.current) {
      const fetchProjects = async () => {
        try {
          setIsLoading(true)
          setError(null)

          const response = await fetch('/api/projects')

          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`)
          }

          const data = (await response.json()) as Project[]
          setProjects(data)
        } catch (error) {
          console.error('Error fetching projects:', error)
          setError('Cannot load projects. Please try again later.')
        } finally {
          setIsLoading(false)
          hasInitialized.current = true
        }
      }

      fetchProjects()
    }
  }, [setProjects])

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600">
            Projects
          </h2>
          <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            Featured Projects
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
          </div>
        )}

        {error && (
          <div className="mt-8 text-center text-red-500">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && projects.length === 0 && (
          <div className="mt-8 text-center text-gray-500">
            <p>No projects available.</p>
          </div>
        )}

        {!isLoading && !error && projects.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project.id} className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
