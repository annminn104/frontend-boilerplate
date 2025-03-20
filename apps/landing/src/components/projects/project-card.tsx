import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from '@fe-boilerplate/ui'
import { Image } from '@/components/ui/image'
import type { ProjectCardProps } from '@/types/project'

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden">
      {project.image && (
        <Image
          src={project.image}
          alt={project.title}
          wrapperClassName="relative h-48"
          fill
          className="object-cover"
        />
      )}
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          {project.url && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                Visit Site
              </a>
            </Button>
          )}
          {project.github && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                View Code
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
