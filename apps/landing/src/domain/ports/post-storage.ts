import type {
  Post,
  CreatePostDTO,
  UpdatePostDTO,
  ListPostsParams,
  ListPostsResult,
} from '../entities/post'

export interface PostStorage {
  findMany(params: ListPostsParams): Promise
  findById(id: string): Promise
  findBySlug(slug: string): Promise
  create(data: CreatePostDTO): Promise
  update(data: UpdatePostDTO): Promise
  delete(id: string): Promise
}
