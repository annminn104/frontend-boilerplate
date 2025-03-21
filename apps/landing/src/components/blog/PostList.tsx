'use client'

import { trpc } from '@/lib/trpc'
import { PostCard } from './PostCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export function PostList() {
  const { data: posts, isLoading } = trpc.post.getAllPublished.useQuery()

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (!posts?.length) {
    return <div className="text-center py-12 text-gray-500">No posts available yet.</div>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
