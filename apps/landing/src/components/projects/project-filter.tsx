'use client'

import { Button } from '@fe-boilerplate/ui'
import { useTranslation } from 'react-i18next'

interface ProjectFilterProps {
  selectedTag?: string
  tags: string[]
  onTagChange: (tag?: string) => void
}

export function ProjectFilter({ selectedTag, tags, onTagChange }: ProjectFilterProps) {
  const { t } = useTranslation('projects')

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <Button
        variant={!selectedTag ? 'default' : 'outline'}
        size="sm"
        onClick={() => onTagChange(undefined)}
      >
        {t('filters.all')}
      </Button>
      {tags.map((tag) => (
        <Button
          key={tag}
          variant={selectedTag === tag ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTagChange(tag)}
        >
          {tag}
        </Button>
      ))}
    </div>
  )
}
