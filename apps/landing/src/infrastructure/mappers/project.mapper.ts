import type { Project } from '@/domain/entities/project'

export class ProjectMapper {
  static toDomain(raw: any): Project {
    return {
      id: raw.id,
      title: raw.title,
      description: raw.description,
      image: raw.image || undefined,
      url: raw.url || undefined,
      github: raw.github || undefined,
      tags: raw.tags,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    }
  }

  static toPersistence(domain: Partial): any {
    return {
      id: domain.id,
      title: domain.title,
      description: domain.description,
      image: domain.image || null,
      url: domain.url || null,
      github: domain.github || null,
      tags: domain.tags,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
    }
  }
}
