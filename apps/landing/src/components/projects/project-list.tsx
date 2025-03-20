import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '@fe-boilerplate/ui'
import { ProjectCard } from './project-card'
import type { ProjectListProps } from '@/types/project'

export function ProjectList({ projects, isLoading, error, hasMore, onLoadMore }: ProjectListProps) {
  const { t } = useTranslation('projects')

  if (error) {
    return <div className="text-center text-destructive">{t('error')}</div>
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 text-center">
          <Button onClick={onLoadMore} disabled={isLoading}>
            {isLoading ? t('common:loading') : t('loadMore')}
          </Button>
        </div>
      )}
    </div>
  )
}
