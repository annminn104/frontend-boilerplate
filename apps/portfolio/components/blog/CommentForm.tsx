'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@/lib/trpc'
import { commentSchema, type Comment } from '@/lib/validations/blog'

interface CommentFormProps {
  postId: string
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const utils = trpc.useContext()

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
      utils.post.getById.invalidate(postId)
      reset()
    },
  })

  const onSubmit = async (data: Comment) => {
    setIsSubmitting(true)
    try {
      await addComment.mutateAsync({
        postId,
        content: data.content,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
      <div className="mb-4">
        <textarea
          {...register('content')}
          rows={3}
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-600"
          placeholder="Write a comment..."
        />
        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  )
}
