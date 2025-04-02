export enum UserRole {
  OWNER = 'OWNER',
  USER = 'USER',
}

export interface User {
  id: string
  clerkId: string
  email: string
  name?: string
  avatar?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface UserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByClerkId(clerkId: string): Promise<User | null>
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>
  update(id: string, data: Partial<User>): Promise<User>
  delete(id: string): Promise<void>
}
