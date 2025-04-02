'use client'

import { useState } from 'react'
import { useComments } from '../hooks/useComments'
import { CommentItem } from './CommentItem'

interface CommentListProps {
  postId: string
}

export function CommentList({ postId }: CommentListProps) {
  const [newComment, setNewComment] = useState('')
  const { comments, isLoading, createComment, updateComment, deleteComment, likeComment, unlikeComment } =
    useComments(postId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    await createComment(newComment.trim())
    setNewComment('')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">Loading comments...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* New comment form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none"
          rows={4}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
          >
            Post Comment
          </button>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-6">
        {comments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={createComment}
            onEdit={updateComment}
            onDelete={deleteComment}
            onLike={likeComment}
            onUnlike={unlikeComment}
          />
        ))}

        {comments.length === 0 && (
          <div className="rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  )
}
