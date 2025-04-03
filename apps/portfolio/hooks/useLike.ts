import { trpc } from '@/lib/trpc'
import { useState } from 'react'

export const useLike = (commentId: string, initialLikeCount: number, initialIsLiked: boolean) => {
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const utils = trpc.useUtils()

  const { mutate: likeMutation, isPending: isLiking } = trpc.like.like.useMutation({
    onSuccess: () => {
      setLikeCount(prev => prev + 1)
      setIsLiked(true)
      utils.like.getLikeCount.invalidate({ commentId })
      utils.like.isLiked.invalidate({ commentId })
    },
  })

  const { mutate: unlikeMutation, isPending: isUnliking } = trpc.like.unlike.useMutation({
    onSuccess: () => {
      setLikeCount(prev => prev - 1)
      setIsLiked(false)
      utils.like.getLikeCount.invalidate({ commentId })
      utils.like.isLiked.invalidate({ commentId })
    },
  })

  const handleLikeToggle = () => {
    if (isLiked) {
      unlikeMutation({ commentId })
    } else {
      likeMutation({ commentId })
    }
  }

  return {
    likeCount,
    isLiked,
    handleLikeToggle,
    isLoading: isLiking || isUnliking,
  }
}
