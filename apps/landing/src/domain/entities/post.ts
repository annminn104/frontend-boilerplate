export interface Post {
  id: string
  slug: string
  title: string
  content: string
  excerpt?: string
  image?: string
  tags: string[]
  published: boolean
  authorId: string
  createdAt: string
  updatedAt: string
}

export interface CreatePostDTO {
  title: string
  content: string
  excerpt?: string
  image?: string
  tags: string[]
  published?: boolean
  authorId: string
}

export interface UpdatePostDTO extends Partial {
  id: string
}

export interface ListPostsParams {
  limit?: number
  cursor?: string
  tag?: string
  search?: string
  published?: boolean
}

export interface ListPostsResult {
  posts: Post[]
  nextCursor?: string
}
