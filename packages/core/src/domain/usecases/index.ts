import type { User, Product } from '../entities'
import type { UserRepository, ProductRepository } from '../repositories'

export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<User> {
    return this.userRepository.getUser(id)
  }
}

export class ListProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.listProducts()
  }
}
