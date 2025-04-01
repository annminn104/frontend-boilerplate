import { useState, useEffect, ChangeEvent } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@fe-boilerplate/ui'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchAndFilterProps {
  onSearch: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchAndFilter({ onSearch, placeholder = 'Search...', className = '' }: SearchAndFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    onSearch(debouncedSearchTerm)
  }, [debouncedSearchTerm, onSearch])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input value={searchTerm} onChange={handleChange} placeholder={placeholder} className="pl-9 w-[300px]" />
    </div>
  )
}
