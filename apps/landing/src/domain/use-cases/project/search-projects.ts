import type { Project, ListProjectsParams, ListProjectsResult } from '../../entities/project'
import type { ProjectStorage } from '../../ports/project-storage'

export class SearchProjectsUseCase {
  constructor(private storage: ProjectStorage) {}

  async execute(params: ListProjectsParams): Promise {
    return this.storage.findMany(params)
  }
}
