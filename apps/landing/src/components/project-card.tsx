import type { Project } from '@/domain/entities/project'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
} from '@fe-boilerplate/ui'
import { Github, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useTranslation('projects')

  return (
    <Card>
      {project.image && (
        <div className="aspect-video overflow-hidden">
          <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
        </div>
      )}
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {project.url && (
          <Button variant="outline" size="sm" asChild>
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              <Globe className="mr-2 h-4 w-4" />
              {t('viewSite')}
            </a>
          </Button>
        )}
        {project.github && (
          <Button variant="outline" size="sm" asChild>
            <a href={project.github} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              {t('viewCode')}
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
