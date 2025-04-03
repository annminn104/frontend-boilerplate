'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { postSchema, type Post } from '@/lib/validations/blog'
import { trpc } from '@/lib/trpc'

interface PostFormProps {
  post?: Post & { id: string }
  onSuccess?: () => void
}

export function PostForm({ post, onSuccess }: PostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const utils = trpc.useUtils()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Post>({
    resolver: zodResolver(postSchema),
    defaultValues: post,
  })

  const createPost = trpc.post.create.useMutation({
    onSuccess: () => {
      utils.post.getAllPublished.invalidate()
      onSuccess?.()
    },
  })

  const updatePost = trpc.post.update.useMutation({
    onSuccess: () => {
      utils.post.getAllPublished.invalidate()
      onSuccess?.()
    },
  })

  const onSubmit = async (data: Post) => {
    setIsSubmitting(true)
    try {
      if (post?.id) {
        await updatePost.mutateAsync({ id: post.id, data })
      } else {
        await createPost.mutateAsync(data)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title
        </label>
        <input
          {...register('title')}
          type="text"
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-600"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          Content
        </label>
        <textarea
          {...register('content')}
          rows={8}
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-600"
        />
        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <input
          {...register('published')}
          type="checkbox"
          className="rounded border-gray-300 text-purple-600 focus:ring-purple-600"
        />
        <label className="text-sm font-medium">Publish immediately</label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
      </button>
    </form>
  )
}
