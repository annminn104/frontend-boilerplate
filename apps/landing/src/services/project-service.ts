import type { ProjectStorage } from '@/domain/ports'
import type {
  Project,
  CreateProjectDTO,
  UpdateProjectDTO,
  ListProjectsParams,
} from '@/domain/entities'
import {
  ListProjectsUseCase,
  CreateProjectUseCase,
  UpdateProjectUseCase,
  DeleteProjectUseCase,
} from '@/domain/use-cases'

export class ProjectService {
  private listProjectsUseCase: ListProjectsUseCase
  private createProjectUseCase: CreateProjectUseCase
  private updateProjectUseCase: UpdateProjectUseCase
  private deleteProjectUseCase: DeleteProjectUseCase

  constructor(storage: ProjectStorage) {
    this.listProjectsUseCase = new ListProjectsUseCase(storage)
    this.createProjectUseCase = new CreateProjectUseCase(storage)
    this.updateProjectUseCase = new UpdateProjectUseCase(storage)
    this.deleteProjectUseCase = new DeleteProjectUseCase(storage)
  }

  async listProjects(params: ListProjectsParams) {
    return this.listProjectsUseCase.execute(params)
  }

  async createProject(data: CreateProjectDTO) {
    return this.createProjectUseCase.execute(data)
  }

  async updateProject(data: UpdateProjectDTO) {
    return this.updateProjectUseCase.execute(data)
  }

  async deleteProject(id: string) {
    return this.deleteProjectUseCase.execute(id)
  }
}
