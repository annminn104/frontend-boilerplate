'use client'

import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useTranslation } from 'react-i18next'
import { useProject } from '@/contexts/project-context'
import useProjectStore from '@/store/use-project-store'
import { ProjectCard } from '../project-card'
import { ProjectFilter } from '../projects/project-filter'
import { ProjectSearch } from '../projects/project-search'
import { ProjectSkeleton } from '../projects/project-skeleton'

export function Projects() {
  const { t } = useTranslation('projects')
  const {
    projects,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    searchTerm,
    setSearchTerm,
    fetchNextPage,
  } = useProject()
  const { selectedTag, setSelectedTag } = useProjectStore()

  // Infinite scroll
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  const uniqueTags = projects.reduce((acc: string[], project) => {
    project.tags.forEach((tag) => {
      if (!acc.includes(tag)) {
        acc.push(tag)
      }
    })
    return acc
  }, [])

  return (
    <section className="container space-y-6 py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">{t('title')}</h2>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <ProjectSearch value={searchTerm} onSearch={setSearchTerm} />
        <ProjectFilter
          selectedTag={selectedTag ? String(selectedTag) : undefined}
          tags={uniqueTags}
          onTagChange={(tag?: string) => setSelectedTag(tag as any)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {isLoading ? (
          <>
            <ProjectSkeleton />
            <ProjectSkeleton />
            <ProjectSkeleton />
          </>
        ) : error ? (
          <div className="col-span-full text-center text-destructive">{t('error')}</div>
        ) : projects.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground">{t('noResults')}</div>
        ) : (
          <>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {hasNextPage && (
              <div ref={ref} className="col-span-full flex justify-center p-4" aria-hidden="true">
                {isFetchingNextPage && <ProjectSkeleton />}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
