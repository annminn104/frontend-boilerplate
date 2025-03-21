export interface Project {
  title: string
  description: string
  image: string
  technologies: string[]
}

export interface ProjectsContent {
  projects: Project[]
}

export interface PortfolioSection {
  type: 'introduction' | 'techStack' | 'workExperience' | 'projects' | 'contact'
  title: string
  content: ProjectsContent
  order: number
}
