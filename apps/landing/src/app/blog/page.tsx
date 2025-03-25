import { auth } from '@clerk/nextjs/server'
import PostList from '@/components/blog/PostList'
import CreatePostButton from '@/components/blog/CreatePostButton'

export default async function BlogPage() {
  const { userId } = await auth()
  const isOwner = userId === process.env.NEXT_PUBLIC_OWNER_USER_ID

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog</h1>
        {isOwner && <CreatePostButton />}
      </div>
      <PostList />
    </div>
  )
}
