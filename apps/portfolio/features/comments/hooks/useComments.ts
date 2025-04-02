'use client'

import { trpc } from '@/lib/trpc'

export function useComments(postId: string) {
  const utils = trpc.useUtils()
  const queryKey = ['comment.getByPostId', { input: postId }]

  const { data: comments = [], isLoading } = trpc.comment.getByPostId.useQuery({ postId })

  const createCommentMutation = trpc.comment.create.useMutation({
    onSuccess: () => {
      utils.comment.getByPostId.invalidate({ postId })
    },
  })

  const updateCommentMutation = trpc.comment.update.useMutation({
    onSuccess: () => {
      utils.comment.getByPostId.invalidate({ postId })
    },
  })

  const deleteCommentMutation = trpc.comment.delete.useMutation({
    onSuccess: () => {
      utils.comment.getByPostId.invalidate({ postId })
    },
  })

  const likeCommentMutation = trpc.comment.likeComment.useMutation({
    onSuccess: () => {
      utils.comment.getByPostId.invalidate({ postId })
    },
  })

  const unlikeCommentMutation = trpc.comment.unlikeComment.useMutation({
    onSuccess: () => {
      utils.comment.getByPostId.invalidate({ postId })
    },
  })

  const createComment = async (content: string, parentId?: string) => {
    await createCommentMutation.mutateAsync({
      content,
      postId,
      parentId: parentId ?? null,
    })
  }

  const updateComment = async (commentId: string, content: string) => {
    await updateCommentMutation.mutateAsync({
      id: commentId,
      content,
    })
  }

  const deleteComment = async (commentId: string) => {
    await deleteCommentMutation.mutateAsync(commentId)
  }

  const likeComment = async (commentId: string) => {
    await likeCommentMutation.mutateAsync({ id: commentId })
  }

  const unlikeComment = async (commentId: string) => {
    await unlikeCommentMutation.mutateAsync({ id: commentId })
  }

  return {
    comments,
    isLoading,
    createComment,
    updateComment,
    deleteComment,
    likeComment,
    unlikeComment,
  }
}
