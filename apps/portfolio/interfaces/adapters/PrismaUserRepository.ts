import { PrismaClient } from '@prisma/client'
import { User, UserRepository } from '@/core/entities/User'

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  private toDomainUser(user: any): User | null {
    if (!user) return null
    return {
      ...user,
      name: user.name ?? undefined,
      avatar: user.avatar ?? undefined,
    }
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } })
    return this.toDomainUser(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } })
    return this.toDomainUser(user)
  }

  async findByClerkId(clerkId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { clerkId } })
    return this.toDomainUser(user)
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const created = await this.prisma.user.create({ data: user })
    return this.toDomainUser(created)!
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const updated = await this.prisma.user.update({ where: { id }, data })
    return this.toDomainUser(updated)!
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } })
  }
}
