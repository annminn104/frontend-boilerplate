'use client'

import { useState } from 'react'
import { useProject } from '@/contexts/project-context'
import { ProjectTable } from '@/components/admin/project-table'
import { ProjectForm } from '@/components/admin/project-form'
import type { Project } from '@/domain/entities/project'
import { Button } from '@fe-boilerplate/ui'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@fe-boilerplate/ui'

export default function ProjectsPage() {
  const { createProject, updateProject, deleteProject } = useProject()
  const [selectedProject, setSelectedProject] = useState<Project>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSubmit = async (data: any) => {
    if (selectedProject) {
      await updateProject({ id: selectedProject.id, ...data })
    } else {
      await createProject(data)
    }
    setIsDialogOpen(false)
    setSelectedProject(undefined)
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Add Project</Button>
      </div>

      <ProjectTable
        onEdit={(project) => {
          setSelectedProject(project)
          setIsDialogOpen(true)
        }}
        onDelete={async (project) => {
          if (confirm('Are you sure?')) {
            await deleteProject(project.id)
          }
        }}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedProject ? 'Edit Project' : 'Add Project'}</DialogTitle>
          </DialogHeader>
          <ProjectForm project={selectedProject} onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
