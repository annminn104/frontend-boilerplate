'use client'

import { useTranslation } from 'react-i18next'
import { Button } from '@fe-boilerplate/ui'
import { BlogCard } from './blog-card'
import { BlogSkeleton } from './blog-skeleton'
import type { Post } from '@/domain/entities/post'

interface BlogListProps {
  posts: Post[]
  isLoading: boolean
  error?: Error
  hasMore: boolean
  onLoadMore: () => void
}

export function BlogList({ posts, isLoading, error, hasMore, onLoadMore }: BlogListProps) {
  const { t } = useTranslation('blog')

  if (error) {
    return <div className="text-center text-destructive">{t('error')}</div>
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
          </>
        ) : posts.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground">{t('noPosts')}</div>
        ) : (
          posts.map((post) => <BlogCard key={post.id} post={post} />)
        )}
      </div>
      {hasMore && (
        <div className="mt-8 text-center">
          <Button onClick={onLoadMore} disabled={isLoading}>
            {isLoading ? t('loading') : t('loadMore')}
          </Button>
        </div>
      )}
    </div>
  )
}
