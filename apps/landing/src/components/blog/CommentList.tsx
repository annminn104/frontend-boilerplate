'use client'

import { useAuth } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { trpc } from '@/lib/trpc'
import { formatDistanceToNow } from 'date-fns'

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

export function CommentList({ comments, postId }: CommentListProps) {
  const { userId } = useAuth()
  const utils = trpc.useContext()

  const deleteComment = trpc.post.deleteComment.useMutation({
    onSuccess: () => {
      utils.post.getById.invalidate(postId)
    },
  })

  const handleDelete = async (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      await deleteComment.mutateAsync(commentId)
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
                className="text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                Delete
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
