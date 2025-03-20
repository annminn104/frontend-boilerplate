import { supabase } from '@/lib/supabase'
import type { ProjectStorage } from '@/domain/ports'
import type {
  Project,
  CreateProjectDTO,
  UpdateProjectDTO,
  ListProjectsParams,
  ListProjectsResult,
} from '@/domain/entities'
import { ProjectMapper } from '../mappers/project.mapper'

export class SupabaseProjectStorage implements ProjectStorage {
  async findMany(params: ListProjectsParams): Promise {
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

    let nextCursor: string | undefined = undefined
    if (items && items.length > limit) {
      const nextItem = items.pop()
      nextCursor = nextItem!.created_at
    }

    return {
      projects: items?.map(ProjectMapper.toDomain) ?? [],
      nextCursor,
    }
  }

  async findById(id: string): Promise {
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()

    if (error) throw error
    return data ? ProjectMapper.toDomain(data) : null
  }

  async create(data: CreateProjectDTO): Promise {
    const { data: project, error } = await supabase
      .from('projects')
      .insert(ProjectMapper.toPersistence(data as Project))
      .select()
      .single()

    if (error) throw error
    return ProjectMapper.toDomain(project)
  }

  async update(data: UpdateProjectDTO): Promise {
    const { id, ...rest } = data
    const { data: project, error } = await supabase
      .from('projects')
      .update(ProjectMapper.toPersistence(rest as Project))
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return ProjectMapper.toDomain(project)
  }

  async delete(id: string): Promise {
    const { error } = await supabase.from('projects').delete().eq('id', id)

    if (error) throw error
  }
}
