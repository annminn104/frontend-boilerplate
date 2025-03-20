import type {
  Project,
  CreateProjectDTO,
  UpdateProjectDTO,
  ListProjectsParams,
  ListProjectsResult,
} from '../entities/project'

export interface ProjectStorage {
  findMany(params: ListProjectsParams): Promise
  findById(id: string): Promise
  create(data: CreateProjectDTO): Promise
  update(data: UpdateProjectDTO): Promise
  delete(id: string): Promise
}
