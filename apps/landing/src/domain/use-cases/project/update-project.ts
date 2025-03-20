import type { Project, UpdateProjectDTO } from '../../entities/project'
import type { ProjectStorage } from '../../ports/project-storage'

export class UpdateProjectUseCase {
  constructor(private storage: ProjectStorage) {}

  async execute(data: UpdateProjectDTO): Promise {
    const project = await this.storage.findById(data.id)
    if (!project) {
      throw new Error(`Project with id ${data.id} not found`)
    }
    return this.storage.update(data)
  }
}
