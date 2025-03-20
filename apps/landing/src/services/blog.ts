import { supabase } from '@/lib/supabase'
import { PostMapper } from '@/infrastructure/mappers/post.mapper'
import type { Post } from '@/domain/entities/post'

export async function getBlogPost(slug: string): Promise {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !data) return null

  return PostMapper.toDomain(data)
}

export async function getBlogPosts(params: { limit?: number; cursor?: string; tag?: string }) {
  const { limit = 10, cursor, tag } = params

  let query = supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit + 1)

  if (cursor) {
    query = query.lt('created_at', cursor)
  }

  if (tag) {
    query = query.contains('tags', [tag])
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
