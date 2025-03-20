// Import the Project type from your domain entities
import { Project as DomainProject } from './domain/entities/project'
import { Tag as DomainTag } from './domain/entities/tag'

// Re-export the domain types
export type Project = DomainProject
export type Tag = DomainTag

// You can add other types your application needs here
export interface User {
  id: string
  name: string
  email: string
  // Add other user properties
}
