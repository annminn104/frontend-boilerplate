import { PrismaClient } from '@prisma/client'
import { PrismaCommentRepository } from '../../interfaces/adapters/PrismaCommentRepository'
import { CommentUseCase } from '../../core/usecases/CommentUseCase'
import { createCommentRouter } from '../../interfaces/adapters/CommentTRPCAdapter'

export class Container {
  private static instance: Container
  private prismaClient: PrismaClient
  private commentRepository: PrismaCommentRepository
  private commentUseCase: CommentUseCase

  private constructor() {
    this.prismaClient = new PrismaClient()
    this.commentRepository = new PrismaCommentRepository(this.prismaClient)
    this.commentUseCase = new CommentUseCase(this.commentRepository, this.commentRepository)
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container()
    }
    return Container.instance
  }

  public getCommentRouter() {
    return createCommentRouter(this.commentUseCase)
  }

  public async disconnect() {
    await this.prismaClient.$disconnect()
  }
}
