'use client'

import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc'
import useProjectStore from '@/store/use-project-store'
import type { Project, CreateProjectDTO, UpdateProjectDTO } from '@/domain/entities'

interface ProjectContextType {
  projects: Project[]
  isLoading: boolean
  error: Error | null
  hasNextPage: boolean
  isFetchingNextPage: boolean
  searchTerm: string
  setSearchTerm: (term: string) => void
  fetchNextPage: () => void
  createProject: (data: CreateProjectDTO) => Promise
  updateProject: (data: UpdateProjectDTO) => Promise
  deleteProject: (id: string) => Promise
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const { selectedTag, setProjects } = useProjectStore()
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    trpc.project.list.useInfiniteQuery(
      {
        limit: 9,
        tag: selectedTag ? String(selectedTag) : undefined,
        search: searchTerm,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    )

  const projects = data?.pages.flatMap((page) => page.projects) ?? []

  useEffect(() => {
    setProjects(projects)
  }, [projects, setProjects])

  // Mutations
  const createMutation = trpc.project.create.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['project', 'list']] })
    },
  })

  const updateMutation = trpc.project.update.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['project', 'list']] })
    },
  })

  const deleteMutation = trpc.project.delete.useMutation()

  // Wrap mutation functions to match expected types
  const handleCreateProject = async (data: CreateProjectDTO): Promise => {
    const result = await createMutation.mutateAsync(data)
    return result
  }

  const handleUpdateProject = async (data: UpdateProjectDTO): Promise => {
    const result = await updateMutation.mutateAsync({
      id: data.id,
      title: data.title || '',
      description: data.description || '',
      tags: data.tags || [],
      image: data.image,
      url: data.url,
      github: data.github,
    })
    return result
  }

  const handleDeleteProject = async (id: string): Promise => {
    await deleteMutation.mutateAsync(id)
  }

  const handleFetchNextPage = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        isLoading,
        error: error as Error | null,
        hasNextPage: Boolean(hasNextPage),
        isFetchingNextPage,
        searchTerm,
        setSearchTerm,
        fetchNextPage: handleFetchNextPage,
        createProject: handleCreateProject,
        updateProject: handleUpdateProject,
        deleteProject: handleDeleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}
