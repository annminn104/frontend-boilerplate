'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@/lib/trpc'
import { commentSchema, type Comment } from '@/lib/validations/blog'
import { useRouter } from 'next/navigation'

interface CommentFormProps {
  postId: string
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const utils = trpc.useContext()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Comment>({
    resolver: zodResolver(commentSchema),
  })

  const addComment = trpc.post.addComment.useMutation({
    onSuccess: () => {
      // Invalidate both post detail and list views
      utils.post.getById.invalidate(postId)
      utils.post.getAllPublished.invalidate()
      router.refresh()
      reset()
    },
    onError: error => {
      console.error('Failed to add comment:', error)
      alert('Failed to add comment. Please try again.')
    },
  })

  const onSubmit = async (data: Comment) => {
    if (addComment.isPending) return

    try {
      await addComment.mutateAsync({
        postId,
        content: data.content,
      })
    } catch (error) {
      // Error is handled in onError callback
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
      <div className="mb-4">
        <textarea
          {...register('content')}
          rows={3}
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-600 dark:bg-gray-800 dark:border-gray-700"
          placeholder="Write a comment..."
          disabled={addComment.isPending}
        />
        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
      </div>
      <button
        type="submit"
        disabled={addComment.isPending}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
      >
        {addComment.isPending ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  )
}
