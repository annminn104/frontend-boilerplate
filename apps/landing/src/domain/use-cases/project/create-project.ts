import type { Project, CreateProjectDTO } from '../../entities/project'
import type { ProjectStorage } from '../../ports/project-storage'

export class CreateProjectUseCase {
  constructor(private storage: ProjectStorage) {}

  async execute(data: CreateProjectDTO): Promise {
    // Add business validation here if needed
    return this.storage.create(data)
  }
}
