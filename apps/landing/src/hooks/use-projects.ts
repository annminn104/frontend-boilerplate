import { trpc } from '@/lib/trpc'
import type { Project } from '@/domain/entities/project'

export function useProjects(options?: { limit?: number; tag?: string }) {
  const { data, isLoading, error, fetchNextPage, hasNextPage } = trpc.project.list.useInfiniteQuery(
    {
      limit: options?.limit ?? 10,
      tag: options?.tag,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  )

  const projects =
    data?.pages.flatMap((page) =>
      page.projects.map((project) => ({
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt),
      }))
    ) ?? []

  return {
    projects,
    isLoading,
    error,
    loadMore: fetchNextPage,
    hasMore: hasNextPage,
  }
}
