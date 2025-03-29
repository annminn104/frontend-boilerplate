import { useAuth } from '@clerk/nextjs'
import { trpc } from '@/lib/trpc'

export function useCurrentUser() {
  const { userId } = useAuth()
  const { data: user, isLoading } = trpc.user.getCurrent.useQuery(undefined, { enabled: !!userId })

  return {
    user,
    isLoading,
  }
}
