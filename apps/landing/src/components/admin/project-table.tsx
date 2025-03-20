'use client'

import { Button } from '@fe-boilerplate/ui'
import { Edit, Trash } from 'lucide-react'
import { useProject } from '@/contexts/project-context'
import type { Project } from '@/domain/entities'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@fe-boilerplate/ui'

interface ProjectTableProps {
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}

export function ProjectTable({ onEdit, onDelete }: ProjectTableProps) {
  const { projects } = useProject()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project: Project) => (
          <TableRow key={project.id}>
            <TableCell>{project.title}</TableCell>
            <TableCell>{project.description}</TableCell>
            <TableCell>{project.tags.join(', ')}</TableCell>
            <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => onEdit(project)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => onDelete(project)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
