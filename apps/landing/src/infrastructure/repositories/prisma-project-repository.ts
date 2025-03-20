import { supabase } from '@/lib/supabase'
import type {
  Project,
  CreateProjectDTO,
  UpdateProjectDTO,
  ListProjectsParams,
} from '@/domain/entities'
import type { ProjectStorage } from '@/domain/ports'

export class SupabaseProjectRepository implements ProjectStorage {
  async findMany(params: ListProjectsParams) {
    const { limit = 10, cursor, tag, search } = params

    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit + 1)

    if (cursor) {
      query = query.lt('created_at', cursor)
    }

    if (tag) {
      query = query.contains('tags', [tag])
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: items, error } = await query

    if (error) throw error

    let nextCursor: string | undefined
    if (items && items.length > limit) {
      const nextItem = items.pop()
      nextCursor = nextItem!.created_at
    }

    return {
      projects:
        items?.map((item) => ({
          ...item,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        })) ?? [],
      nextCursor,
    }
  }

  async findById(id: string) {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()

    if (error || !data) return null

    return {
      ...data,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }

  async create(data: CreateProjectDTO) {
    const { data: created, error } = await supabase
      .from('projects')
      .insert({
        title: data.title,
        description: data.description,
        image: data.image || null,
        url: data.url || null,
        github: data.github || null,
        tags: data.tags,
      })
      .select()
      .single()

    if (error) throw error

    return {
      ...created,
      createdAt: created.created_at,
      updatedAt: created.updated_at,
    }
  }

  async update(data: UpdateProjectDTO) {
    const { id, ...rest } = data
    const { data: updated, error } = await supabase
      .from('projects')
      .update(rest)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      ...updated,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
    }
  }

  async delete(id: string) {
    const { error } = await supabase.from('projects').delete().eq('id', id)

    if (error) throw error
  }
}
