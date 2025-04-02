'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { trpc } from '@/lib/trpc'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { cn } from '@/lib/utils'

// Project type from database
interface ProjectData {
  id: string
  title: string
  description: string
  imageUrl: string | null
  tags: string[]
  featured: boolean
  published: boolean
  demoUrl: string | null
  githubUrl: string | null
  order: number
  createdAt: Date
  updatedAt: Date
}

export default function Projects() {
  // Get section title using a regular query
  const { data: section } = trpc.portfolio.getSection.useQuery('projects', {
    enabled: true,
  })

  // Get published projects using a regular query
  const {
    data: projects = [],
    isLoading,
    error,
  } = trpc.project.getAllPublished.useQuery(undefined, {
    enabled: true,
    // Refresh data every 5 minutes
    refetchInterval: 5 * 60 * 1000,
  })

  if (error) {
    return (
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <p className="text-center text-red-500" role="alert">
            Failed to load projects. Please try again later.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-900" id="projects">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">{section?.title || 'Projects'}</h2>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <LoadingSpinner />
          </div>
        ) : projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: ProjectData) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={cn(
                  'bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg',
                  'transition-transform duration-300 hover:scale-[1.02]'
                )}
              >
                {project.imageUrl && (
                  <div className="relative h-48">
                    <Image
                      src={project.imageUrl}
                      alt={`${project.title} project thumbnail`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2" role="list" aria-label="Technologies used">
                    {project.tags.map((tag: string) => (
                      <span
                        key={tag}
                        role="listitem"
                        className={cn(
                          'px-3 py-1 text-sm rounded-full',
                          'bg-purple-100 dark:bg-purple-900',
                          'text-purple-600 dark:text-purple-300'
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {(project.demoUrl || project.githubUrl) && (
                    <div className="mt-4 flex gap-4">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          View Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          View Code
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400" role="status">
            No projects available yet.
          </p>
        )}
      </div>
    </section>
  )
}
