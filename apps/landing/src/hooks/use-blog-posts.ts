import { useInfiniteQuery } from '@tanstack/react-query'
import { getBlogPosts } from '@/services/blog'
import type { ListPostsResult } from '@/domain/entities/post'

interface UseBlogPostsOptions {
  limit?: number
  tag?: string
}

export function useBlogPosts(options?: UseBlogPostsOptions) {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['blog-posts', options],
      queryFn: async ({ pageParam = null }) => {
        return getBlogPosts({
          limit: options?.limit,
          tag: options?.tag,
          cursor: pageParam as string | undefined,
        })
      },
      initialPageParam: null,
      getNextPageParam: (lastPage: ListPostsResult) => lastPage.nextCursor,
    })

  const posts = data?.pages.flatMap((page: ListPostsResult) => page.posts) ?? []

  return {
    posts,
    isLoading,
    error,
    hasMore: hasNextPage,
    loadMore: fetchNextPage,
    isLoadingMore: isFetchingNextPage,
  }
}
