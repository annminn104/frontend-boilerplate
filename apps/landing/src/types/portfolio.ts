export interface PortfolioItem {
  id: string
  title: string
  description: string
  fullDescription?: string
  challenge?: string
  solution?: string
  results?: string
  client?: string
  slug: string
  imageUrl?: string | null
  category: string
  technologies: string[]
  completionDate: string
  createdAt: string
  updatedAt: string
}
