'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { trpc } from '@/lib/trpc'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@fe-boilerplate/ui'
import { PostForm } from '@/components/blog/PostForm'
import { PlusCircle, Edit2, Trash2, AlertTriangle, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function PostsAdminPage() {
  const router = useRouter()
  const [editingPost, setEditingPost] = useState<any>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const utils = trpc.useContext()

  const { data: posts, isLoading } = trpc.post.getAllForAdmin.useQuery()

  const deletePost = trpc.post.delete.useMutation({
    onSuccess: () => {
      utils.post.getAllForAdmin.invalidate()
      setConfirmDeleteId(null)
    },
  })

  const handleEditClick = (post: any) => {
    setEditingPost(post)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (post: any) => {
    setEditingPost(post)
    setConfirmDeleteId(post.id)
  }

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return

    setDeletingId(confirmDeleteId)
    try {
      await deletePost.mutateAsync(confirmDeleteId)
    } finally {
      setDeletingId(null)
    }
  }

  const handleFormSuccess = () => {
    setIsCreateModalOpen(false)
    setIsEditModalOpen(false)
    utils.post.getAllForAdmin.invalidate()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts Management</h1>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Post
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : posts?.length === 0 ? (
        <div className="bg-background rounded-lg p-8 text-center">
          <p className="text-lg text-muted-foreground">No posts found</p>
          <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4 flex items-center gap-2 mx-auto">
            <PlusCircle className="h-4 w-4" />
            Create your first post
          </Button>
        </div>
      ) : (
        <div className="bg-background rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted">
                {posts?.map(post => (
                  <tr key={post.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="line-clamp-1 font-medium">{post.title}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.published
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                        }`}
                      >
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-muted-foreground flex items-center gap-3">
                        <span>{post._count.comments} comments</span>
                        <span>•</span>
                        <span>{post._count.likes} likes</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blog/${post.id}`}
                          className="p-2 text-primary rounded-md hover:bg-primary/10"
                          title="View post"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(post)}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          title="Edit post"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(post)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                          title="Delete post"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Post Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <PostForm onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          {editingPost && (
            <PostForm
              post={{
                id: editingPost.id,
                title: editingPost.title,
                content: editingPost.content,
                published: editingPost.published,
              }}
              onSuccess={handleFormSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!confirmDeleteId} onOpenChange={open => !open && setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone. All comments associated with this
              post will also be deleted.
            </DialogDescription>
          </DialogHeader>

          {editingPost && (
            <div className="my-4 p-4 bg-muted/50 rounded-md">
              <p className="text-sm font-medium">Post:</p>
              <p className="text-sm mt-1 font-medium">{editingPost.title}</p>
              <div className="mt-2 text-xs text-muted-foreground">
                {editingPost._count.comments} comments • {editingPost._count.likes} likes
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
                'Delete Post'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
