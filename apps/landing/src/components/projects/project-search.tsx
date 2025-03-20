'use client'

import { useCallback } from 'react'
import { Input } from '@fe-boilerplate/ui'
import { Search, Loader } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

interface ProjectSearchProps {
  value: string
  onSearch: (term: string) => void
  isLoading?: boolean
}

export function ProjectSearch({ value, onSearch, isLoading }: ProjectSearchProps) {
  const debouncedSearch = useDebounce(onSearch, 300)

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search projects..."
        value={value}
        onChange={(e) => debouncedSearch(e.target.value)}
        className="pl-9"
        disabled={isLoading}
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}
