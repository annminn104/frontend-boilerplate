import { create } from 'zustand'
import { Project } from '../domain/entities/project'
import { Tag } from '../domain/entities/tag'

interface ProjectState {
  selectedProject: Project | null
  setSelectedProject: (project: Project | null) => void
  selectedTag: Tag | null
  setSelectedTag: (tag: Tag | null) => void
  projects: Project[]
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (project: Project) => void
  removeProject: (id: string) => void
}

const useProjectStore = create<ProjectState>((set, get) => ({
  selectedProject: null,
  setSelectedProject: (project) => set({ selectedProject: project }),
  selectedTag: null,
  setSelectedTag: (tag) => set({ selectedTag: tag }),
  projects: [],
  setProjects: (projects) => {
    const currentProjects = get().projects
    if (JSON.stringify(currentProjects) === JSON.stringify(projects)) {
      return
    }
    set({ projects })
  },
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (project) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === project.id ? { ...p, ...project } : p)),
    })),
  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    })),
}))

export default useProjectStore
