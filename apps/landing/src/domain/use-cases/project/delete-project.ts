import type { ProjectStorage } from '../../ports/project-storage'

export class DeleteProjectUseCase {
  constructor(private storage: ProjectStorage) {}

  async execute(id: string): Promise {
    const project = await this.storage.findById(id)
    if (!project) {
      throw new Error(`Project with id ${id} not found`)
    }
    return this.storage.delete(id)
  }
}
