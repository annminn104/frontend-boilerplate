'use client'

import { useState } from 'react'
import { type Comment } from '../types/comment'
import { formatDistanceToNow } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Pencil, Trash2, X } from 'lucide-react'
import { LikeButton } from '@/components/LikeButton'

interface CommentItemProps {
  comment: Comment
  onReply: (content: string, parentId?: string) => Promise<void>
  onEdit: (commentId: string, content: string) => Promise<void>
  onDelete: (commentId: string) => Promise<void>
}

export function CommentItem({ comment, onReply, onEdit, onDelete }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [replyContent, setReplyContent] = useState('')

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editContent.trim()) return

    await onEdit(comment.id, editContent.trim())
    setIsEditing(false)
  }

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim()) return

    await onReply(replyContent.trim(), comment.id)
    setIsReplying(false)
    setReplyContent('')
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await onDelete(comment.id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-lg border border-gray-200 p-4 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={comment.author.avatar || `https://api.dicebear.com/7.x/avatars/svg?seed=${comment.author.email}`}
            alt={comment.author.name || ''}
            className="h-10 w-10 rounded-full"
          />
          <div>
            <h4 className="font-semibold">{comment.author.name}</h4>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        {comment.isAuthor && (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(!isEditing)} className="rounded p-1 text-gray-500 hover:bg-gray-100">
              {isEditing ? <X size={18} /> : <Pencil size={18} />}
            </button>
            <button onClick={handleDelete} className="rounded p-1 text-red-500 hover:bg-gray-100">
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isEditing ? (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleEdit}
            className="mt-4"
          >
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              rows={3}
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded px-3 py-1 text-sm text-gray-500 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!editContent.trim()}
                className="rounded bg-blue-500 px-3 py-1 text-sm text-white disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4">
            {comment.content}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-4 flex items-center gap-2">
        <LikeButton commentId={comment.id} initialLikeCount={comment._count.likes} initialIsLiked={comment.isLiked} />
        <button
          onClick={() => setIsReplying(!isReplying)}
          className="flex items-center gap-1 rounded-full px-3 py-1 text-sm text-gray-500 hover:bg-gray-100"
        >
          <MessageCircle size={16} />
          Reply
        </button>
      </div>

      <AnimatePresence>
        {isReplying && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleReply}
            className="mt-4"
          >
            <textarea
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              rows={3}
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsReplying(false)}
                className="rounded px-3 py-1 text-sm text-gray-500 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!replyContent.trim()}
                className="rounded bg-blue-500 px-3 py-1 text-sm text-white disabled:opacity-50"
              >
                Reply
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4 border-l-2 border-gray-100 pl-4">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply as unknown as Comment}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
