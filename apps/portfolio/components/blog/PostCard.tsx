'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@fe-boilerplate/ui'
import { trpc } from '@/lib/trpc'
import type { Post } from '@/types/blog'
import { useRouter } from 'next/navigation'

interface PostCardProps {
  post: Pick<Post, 'id' | 'title' | 'content' | 'author' | 'createdAt' | '_count'>
  isOwner: boolean
}

export default function PostCard({ post, isOwner }: PostCardProps) {
  const router = useRouter()
  const utils = trpc.useContext()

  const deletePost = trpc.post.delete.useMutation({
    onSuccess: () => {
      // Invalidate and refetch
      utils.post.getAllPublished.invalidate()
      utils.post.getAllForAdmin.invalidate()
      router.refresh()
    },
  })

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost.mutateAsync(post.id)
      } catch (error) {
        console.error('Failed to delete post:', error)
        alert('Failed to delete post. Please try again.')
      }
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-6">
        <Link href={`/blog/${post.id}`}>
          <h2 className="text-xl font-bold mb-2 hover:text-purple-600 transition-colors">{post.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{post.content}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>By {post.author.name}</span>
            <div className="flex items-center gap-4">
              <span>{post._count.likes} likes</span>
              <span>{post._count.comments} comments</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </div>
        </Link>

        {isOwner && (
          <div className="mt-4 flex gap-2 justify-end">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/posts/edit/${post.id}`} className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deletePost.isPending}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {deletePost.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        )}
      </div>
    </motion.article>
  )
}
