'use client'

import { BlogList } from '@/components/blog/blog-list'
import { useBlogPosts } from '@/hooks/use-blog-posts'

export default function BlogPage() {
  const { posts, isLoading, error, hasMore = false, loadMore } = useBlogPosts()

  return (
    <main className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Blog</h1>
        <p className="mt-2 text-muted-foreground">Latest articles and updates from our team</p>
      </div>

      <BlogList
        posts={posts}
        isLoading={isLoading}
        error={error instanceof Error ? error : undefined}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </main>
  )
}
