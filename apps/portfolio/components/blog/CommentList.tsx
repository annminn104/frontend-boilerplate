'use client'

import { useAuth } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { trpc } from '@/lib/trpc'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
  }
  createdAt: Date
}

interface CommentListProps {
  comments: Comment[]
  postId: string
}

export default function CommentList({ comments, postId }: CommentListProps) {
  const { userId } = useAuth()
  const utils = trpc.useUtils()
  const router = useRouter()

  const deleteComment = trpc.post.deleteComment.useMutation({
    onSuccess: () => {
      // Invalidate both post detail and list views
      utils.post.getById.invalidate(postId)
      utils.post.getAllPublished.invalidate()
      router.refresh()
    },
    onError: error => {
      console.error('Failed to delete comment:', error)
      alert('Failed to delete comment. Please try again.')
    },
  })

  const handleDelete = async (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment.mutateAsync(commentId)
      } catch (error) {
        // Error is handled in onError callback
      }
    }
  }

  return (
    <div className="space-y-6">
      {comments.map((comment, index) => (
        <motion.div
          key={comment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{comment.author.name}</span>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
            {userId === comment.author.id && (
              <button
                onClick={() => handleDelete(comment.id)}
                disabled={deleteComment.isPending}
                className="text-sm text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
              >
                {deleteComment.isPending ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-300">{comment.content}</p>
        </motion.div>
      ))}
      {comments.length === 0 && <p className="text-center text-gray-500">No comments yet.</p>}
    </div>
  )
}
