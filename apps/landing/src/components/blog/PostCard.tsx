'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'
import type { Post } from '@/types/blog'

interface PostCardProps {
  post: Pick<Post, 'id' | 'title' | 'content' | 'author' | 'createdAt' | '_count'>
}

export function PostCard({ post }: PostCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      <Link href={`/blog/${post.id}`}>
        <div className="p-6">
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
        </div>
      </Link>
    </motion.article>
  )
}
