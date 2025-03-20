import type { Project } from '@/domain/entities/project'

export interface ProjectCardProps {
  project: Project
}

export interface ProjectListProps {
  projects: Project[]
  isLoading: boolean
  error?: Error
  hasMore: boolean
  onLoadMore: () => void
}

export interface ProjectFilterProps {
  selectedTag?: string
  onTagChange: (tag: string) => void
  tags: string[]
}
