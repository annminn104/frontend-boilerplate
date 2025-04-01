'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Trash2, AlertTriangle } from 'lucide-react'
import { trpc } from '@/lib/trpc'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@fe-boilerplate/ui'
import Link from 'next/link'

type CommentWithDetails = {
  id: string
  content: string
  createdAt: string | Date
  author: {
    name: string
    email: string
  }
  post: {
    id: string
    title: string
  }
}

export default function CommentsAdminPage() {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [activeComment, setActiveComment] = useState<CommentWithDetails | null>(null)
  const utils = trpc.useContext()

  const { data: comments, isLoading } = trpc.comment.getAllForAdmin.useQuery(undefined, {
    refetchOnWindowFocus: false,
  })

  const deleteComment = trpc.comment.adminDeleteComment.useMutation({
    onSuccess: () => {
      utils.comment.getAllForAdmin.invalidate()
      setConfirmDeleteId(null)
    },
  })

  const handleDeleteClick = (comment: CommentWithDetails) => {
    setActiveComment(comment)
    setConfirmDeleteId(comment.id)
  }

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return

    setDeletingId(confirmDeleteId)
    try {
      await deleteComment.mutateAsync(confirmDeleteId)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Comments Management</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : comments?.length === 0 ? (
        <div className="bg-background rounded-lg p-8 text-center">
          <p className="text-lg text-muted-foreground">No comments found</p>
        </div>
      ) : (
        <div className="bg-background rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted">
                {comments?.map(comment => (
                  <tr key={comment.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 text-sm">
                      <div className="line-clamp-2">{comment.content}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium">{comment.author.name}</div>
                      <div className="text-muted-foreground text-xs">{comment.author.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link href={`/blog/${comment.post.id}`} className="text-primary hover:underline">
                        {comment.post.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(comment)}
                        className="flex items-center"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="ml-2">Delete</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!confirmDeleteId} onOpenChange={open => !open && setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {activeComment && (
            <div className="my-4 p-4 bg-muted/50 rounded-md">
              <p className="text-sm font-medium">Comment:</p>
              <p className="text-sm mt-1">{activeComment.content}</p>
              <div className="mt-2 text-xs text-muted-foreground">
                By {activeComment.author.name} on post "{activeComment.post.title}"
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deletingId === confirmDeleteId}>
              {deletingId === confirmDeleteId ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Comment'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
