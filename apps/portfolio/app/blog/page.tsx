import { isOwner } from '@/lib/auth-utils'
import PostList from '@/components/blog/PostList'
import CreatePostButton from '@/components/blog/CreatePostButton'

export default async function BlogPage() {
  const isUserOwner = await isOwner()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog</h1>
        {isUserOwner && <CreatePostButton />}
      </div>
      <PostList isOwner={isUserOwner} />
    </div>
  )
}
