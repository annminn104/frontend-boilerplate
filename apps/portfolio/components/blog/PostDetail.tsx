'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@clerk/nextjs'
import { trpc } from '@/lib/trpc'
import type { Post } from '@/types/blog'
import { format } from 'date-fns'
import CommentList from './CommentList'
import CommentForm from './CommentForm'

interface PostDetailProps {
  post: Post
  isOwner: boolean
}

export default function PostDetail({ post, isOwner }: PostDetailProps) {
  const router = useRouter()
  const { isSignedIn } = useAuth()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const utils = trpc.useContext()

  const deletePost = trpc.post.delete.useMutation({
    onSuccess: () => {
      // Invalidate all relevant queries
      utils.post.getAllPublished.invalidate()
      utils.post.getAllForAdmin.invalidate()
      router.push('/blog')
      router.refresh()
    },
  })

  const toggleLike = trpc.post.toggleLike.useMutation({
    onSuccess: () => {
      // Invalidate both the post detail and list views
      utils.post.getById.invalidate(post.id)
      utils.post.getAllPublished.invalidate()
      router.refresh()
    },
  })

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost.mutateAsync(post.id)
      } catch (error) {
        console.error('Failed to delete post:', error)
        alert('Failed to delete post. Please try again.')
      }
    }
  }

  return (
    <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="text-sm text-gray-500">{format(new Date(post.createdAt), 'MMMM dd, yyyy')}</div>
        <div className="prose dark:prose-invert max-w-none mb-6">{post.content}</div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-8">
          <span>By {post.author.name}</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleLike.mutate(post.id)}
              disabled={!isSignedIn || toggleLike.isPending}
              className="flex items-center gap-1 hover:text-purple-600 transition-colors disabled:opacity-50"
            >
              <span>{post._count.likes} likes</span>
            </button>
            <span>{post._count.comments} comments</span>
          </div>
        </div>

        {isOwner && (
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setIsEditOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deletePost.isPending}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deletePost.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}

        <div className="border-t dark:border-gray-700 pt-8">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          {isSignedIn ? (
            <CommentForm postId={post.id} />
          ) : (
            <p className="text-gray-500 mb-8">Sign in to leave a comment</p>
          )}
          <CommentList comments={post.comments} postId={post.id} />
        </div>
      </div>
    </motion.article>
  )
}
