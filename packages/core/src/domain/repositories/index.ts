import type { User, Product } from '../entities'

export interface UserRepository {
  getUser(id: string): Promise<User>
  createUser(user: Omit<User, 'id'>): Promise<User>
  updateUser(user: User): Promise<User>
}

export interface ProductRepository {
  getProduct(id: string): Promise<Product>
  listProducts(): Promise<Product[]>
  createProduct(product: Omit<Product, 'id'>): Promise<Product>
}
