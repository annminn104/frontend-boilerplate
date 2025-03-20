export interface Project {
  id: string
  title: string
  description: string
  image?: string | undefined
  url?: string | undefined
  github?: string | undefined
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateProjectDTO {
  title: string
  description: string
  image?: string | undefined
  url?: string | undefined
  github?: string | undefined
  tags: string[]
}

export interface UpdateProjectDTO extends Partial {
  id: string
}

export interface ListProjectsParams {
  limit?: number
  cursor?: string | undefined
  tag?: string | undefined
  search?: string | undefined
}

export interface ListProjectsResult {
  projects: Project[]
  nextCursor?: string
}
