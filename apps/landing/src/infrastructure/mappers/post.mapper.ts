import type { Post } from '@/domain/entities/post'

export class PostMapper {
  static toDomain(raw: any): Post {
    return {
      id: raw.id,
      slug: raw.slug,
      title: raw.title,
      content: raw.content,
      excerpt: raw.excerpt || undefined,
      image: raw.image || undefined,
      tags: raw.tags,
      published: raw.published,
      authorId: raw.author_id,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    }
  }

  static toPersistence(domain: Partial): any {
    return {
      id: domain.id,
      slug: domain.slug,
      title: domain.title,
      content: domain.content,
      excerpt: domain.excerpt || null,
      image: domain.image || null,
      tags: domain.tags,
      published: domain.published,
      author_id: domain.authorId,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
    }
  }
}
