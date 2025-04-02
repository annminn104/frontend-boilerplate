import { middleware } from '../trpc'
import { convertToTRPCError } from '../errorAdapter'
import { ZodError } from 'zod'
import { ValidationError } from '../../core/errors/ApplicationError'

export const errorHandler = middleware(async ({ next }) => {
  try {
    return await next()
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      throw new ValidationError(error.errors[0].message)
    }

    throw convertToTRPCError(error)
  }
})
