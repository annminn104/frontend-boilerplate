'use client'

import { trpc } from '@/lib/trpc'

export function useComments(postId: string) {
  const utils = trpc.useUtils()

  const { data: comments = [], isLoading } = trpc.comment.getByPostId.useQuery({
    postId,
  })

  const createComment = trpc.comment.create.useMutation({
    onSuccess: () => {
      utils.comment.getByPostId.invalidate({ postId })
    },
  })

  const updateComment = trpc.comment.update.useMutation({
    onSuccess: () => {
      utils.comment.getByPostId.invalidate({ postId })
    },
  })

  const deleteComment = trpc.comment.delete.useMutation({
    onSuccess: () => {
      utils.comment.getByPostId.invalidate({ postId })
    },
  })

  const handleCreateComment = async (content: string, parentId?: string) => {
    await createComment.mutateAsync({
      content,
      postId,
      parentId: parentId ?? null,
    })
  }

  const handleUpdateComment = async (commentId: string, content: string) => {
    await updateComment.mutateAsync({
      id: commentId,
      content,
    })
  }

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment.mutateAsync(commentId)
  }

  return {
    comments,
    isLoading,
    createComment: handleCreateComment,
    updateComment: handleUpdateComment,
    deleteComment: handleDeleteComment,
  }
}
