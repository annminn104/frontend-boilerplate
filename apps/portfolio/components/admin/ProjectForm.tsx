'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@/lib/trpc'
import { z } from 'zod'
import { X } from 'lucide-react'
import { Button } from '@fe-boilerplate/ui'

// Project validation schema based on the server schema
const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  content: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
  demoUrl: z.string().url().optional().nullable(),
  githubUrl: z.string().url().optional().nullable(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  order: z.number().default(0),
})

type ProjectFormValues = z.infer<typeof projectSchema>

interface ProjectFormProps {
  project?: ProjectFormValues & { id: string }
  onSuccess?: () => void
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const utils = trpc.useContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: project || {
      title: '',
      description: '',
      content: '',
      imageUrl: '',
      demoUrl: '',
      githubUrl: '',
      tags: [],
      featured: false,
      published: false,
      order: 0,
    },
  })

  const tags = watch('tags')

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue('tags', [...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setValue(
      'tags',
      tags.filter(tag => tag !== tagToRemove)
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const createProject = trpc.project.create.useMutation({
    onSuccess: () => {
      utils.project.getAll.invalidate()
      onSuccess?.()
    },
  })

  const updateProject = trpc.project.update.useMutation({
    onSuccess: () => {
      utils.project.getAll.invalidate()
      onSuccess?.()
    },
  })

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true)
    try {
      if (project?.id) {
        await updateProject.mutateAsync({ id: project.id, data })
      } else {
        await createProject.mutateAsync(data)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title *
            </label>
            <input
              {...register('title')}
              type="text"
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary"
              placeholder="Project title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary"
              placeholder="A short description of the project"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Detailed Content
            </label>
            <textarea
              {...register('content')}
              rows={6}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary"
              placeholder="Detailed content/description (optional)"
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium mb-2">
              Image URL
            </label>
            <input
              {...register('imageUrl')}
              type="url"
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary"
              placeholder="https://example.com/image.jpg"
            />
            {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>}
          </div>

          <div>
            <label htmlFor="demoUrl" className="block text-sm font-medium mb-2">
              Demo URL
            </label>
            <input
              {...register('demoUrl')}
              type="url"
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary"
              placeholder="https://example.com"
            />
            {errors.demoUrl && <p className="text-red-500 text-sm mt-1">{errors.demoUrl.message}</p>}
          </div>

          <div>
            <label htmlFor="githubUrl" className="block text-sm font-medium mb-2">
              GitHub URL
            </label>
            <input
              {...register('githubUrl')}
              type="url"
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary"
              placeholder="https://github.com/username/repo"
            />
            {errors.githubUrl && <p className="text-red-500 text-sm mt-1">{errors.githubUrl.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-4 py-2 rounded-l-lg border focus:ring-2 focus:ring-primary"
                placeholder="Add tags (e.g., React, TypeScript)"
              />
              <Button type="button" onClick={addTag} className="rounded-l-none">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <div key={tag} className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full">
                  <span className="text-sm">{tag}</span>
                  <button type="button" onClick={() => removeTag(tag)} className="text-primary/70 hover:text-primary">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                {...register('featured')}
                type="checkbox"
                id="featured"
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Featured project
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                {...register('published')}
                type="checkbox"
                id="published"
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="published" className="text-sm font-medium">
                Published
              </label>
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full py-3" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
      </Button>
    </form>
  )
}
