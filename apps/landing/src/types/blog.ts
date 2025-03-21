export interface Post {
  id: string
  title: string
  content: string
  published: boolean
  authorId: string
  createdAt: Date
  updatedAt: Date
  author: {
    name: string
  }
  _count: {
    likes: number
    comments: number
  }
}
