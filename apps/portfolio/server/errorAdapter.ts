import { TRPCError } from '@trpc/server'
import { ApplicationError } from '../core/errors/ApplicationError'

const errorCodeMap = {
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  VALIDATION_ERROR: 'BAD_REQUEST',
} as const

export function convertToTRPCError(error: unknown): TRPCError {
  if (error instanceof ApplicationError) {
    return new TRPCError({
      code: errorCodeMap[error.code as keyof typeof errorCodeMap] || 'INTERNAL_SERVER_ERROR',
      message: error.message,
    })
  }

  if (error instanceof Error) {
    return new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message,
      cause: error,
    })
  }

  return new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
  })
}
