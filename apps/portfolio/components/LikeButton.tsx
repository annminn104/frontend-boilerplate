import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useLike } from '@/hooks/useLike'
import clsx from 'clsx'

interface LikeButtonProps {
  commentId: string
  initialLikeCount: number
  initialIsLiked: boolean
}

export const LikeButton = ({ commentId, initialLikeCount, initialIsLiked }: LikeButtonProps) => {
  const { likeCount, isLiked, handleLikeToggle, isLoading } = useLike(commentId, initialLikeCount, initialIsLiked)

  return (
    <button
      onClick={handleLikeToggle}
      disabled={isLoading}
      className={clsx(
        'flex items-center gap-1 rounded-full px-3 py-1 text-sm transition-colors',
        'hover:bg-rose-100 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        isLiked && 'text-rose-600'
      )}
      aria-label={isLiked ? 'Unlike comment' : 'Like comment'}
    >
      {isLiked ? <HeartIconSolid className="h-4 w-4" /> : <HeartIcon className="h-4 w-4" />}
      <span>{likeCount}</span>
    </button>
  )
}
