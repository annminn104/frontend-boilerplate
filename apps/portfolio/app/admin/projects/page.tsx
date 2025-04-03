'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { trpc } from '@/lib/trpc'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@fe-boilerplate/ui'
import { ProjectForm } from '@/components/admin/ProjectForm'
import { PlusCircle, Edit2, Trash2, AlertTriangle, ExternalLink, Star } from 'lucide-react'
import Link from 'next/link'

export default function ProjectsAdminPage() {
  const [editingProject, setEditingProject] = useState<any>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const utils = trpc.useUtils()

  const { data: projects, isLoading } = trpc.project.getAll.useQuery()

  const deleteProject = trpc.project.delete.useMutation({
    onSuccess: () => {
      utils.project.getAll.invalidate()
      setConfirmDeleteId(null)
    },
  })

  const handleEditClick = (project: any) => {
    setEditingProject(project)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (project: any) => {
    setEditingProject(project)
    setConfirmDeleteId(project.id)
  }

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return

    setDeletingId(confirmDeleteId)
    try {
      await deleteProject.mutateAsync(confirmDeleteId)
    } finally {
      setDeletingId(null)
    }
  }

  const handleFormSuccess = () => {
    setIsCreateModalOpen(false)
    setIsEditModalOpen(false)
    utils.project.getAll.invalidate()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects Management</h1>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Project
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : projects?.length === 0 ? (
        <div className="bg-background rounded-lg p-8 text-center">
          <p className="text-lg text-muted-foreground">No projects found</p>
          <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4 flex items-center gap-2 mx-auto">
            <PlusCircle className="h-4 w-4" />
            Create your first project
          </Button>
        </div>
      ) : (
        <div className="bg-background rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
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
                {projects?.map(project => (
                  <tr key={project.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        {project.featured && <Star className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />}
                        <div>
                          <div className="line-clamp-1 font-medium">{project.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1 mt-1">{project.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {project.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.published
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                        }`}
                      >
                        {project.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {project.published && (
                          <Link
                            href={`/projects/${project.id}`}
                            className="p-2 text-primary rounded-md hover:bg-primary/10"
                            title="View project"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(project)}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          title="Edit project"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(project)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                          title="Delete project"
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

      {/* Create Project Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <ProjectForm onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {editingProject && (
            <ProjectForm
              project={{
                id: editingProject.id,
                title: editingProject.title,
                description: editingProject.description,
                content: editingProject.content,
                imageUrl: editingProject.imageUrl,
                demoUrl: editingProject.demoUrl,
                githubUrl: editingProject.githubUrl,
                tags: editingProject.tags,
                featured: editingProject.featured,
                published: editingProject.published,
                order: editingProject.order,
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
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {editingProject && (
            <div className="my-4 p-4 bg-muted/50 rounded-md">
              <p className="text-sm font-medium">Project:</p>
              <p className="text-sm mt-1 font-medium">{editingProject.title}</p>
              <div className="mt-1 text-xs text-muted-foreground">{editingProject.description}</div>
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
                'Delete Project'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
