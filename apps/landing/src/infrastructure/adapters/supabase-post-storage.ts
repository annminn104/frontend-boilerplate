import { supabase } from '@/lib/supabase'
import type { PostStorage } from '@/domain/ports/post-storage'
import type {
  Post,
  CreatePostDTO,
  UpdatePostDTO,
  ListPostsParams,
  ListPostsResult,
} from '@/domain/entities/post'
import { PostMapper } from '../mappers/post.mapper'

export class SupabasePostStorage implements PostStorage {
  async findMany(params: ListPostsParams): Promise {
    const { limit = 10, cursor, tag, search, published = true } = params

    let query = supabase
      .from('posts')
      .select('*')
      .eq('published', published)
      .order('created_at', { ascending: false })
      .limit(limit + 1)

    if (cursor) {
      query = query.lt('created_at', cursor)
    }

    if (tag) {
      query = query.contains('tags', [tag])
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }

    const { data: items, error } = await query

    if (error) throw error

    let nextCursor: string | undefined = undefined
    if (items && items.length > limit) {
      const nextItem = items.pop()
      nextCursor = nextItem!.created_at
    }

    return {
      posts: items?.map(PostMapper.toDomain) ?? [],
      nextCursor,
    }
  }

  async findBySlug(slug: string): Promise {
    const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).single()

    if (error || !data) return null

    return PostMapper.toDomain(data)
  }

  async create(data: CreatePostDTO): Promise {
    const { data: created, error } = await supabase
      .from('posts')
      .insert(PostMapper.toPersistence(data))
      .select()
      .single()

    if (error) throw error

    return PostMapper.toDomain(created)
  }

  async findById(id: string): Promise {
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single()

    if (error) throw error
    return data ? PostMapper.toDomain(data) : null
  }

  async update(data: UpdatePostDTO): Promise {
    const { data: updated, error } = await supabase
      .from('posts')
      .update(PostMapper.toPersistence(data))
      .eq('id', data.id)
      .select()
      .single()

    if (error) throw error
    return PostMapper.toDomain(updated)
  }

  async delete(id: string): Promise {
    const { error } = await supabase.from('posts').delete().eq('id', id)

    if (error) throw error
  }

  // Implement other methods...
}
