import type { NextApiResponse } from 'next'
import { ZodError } from 'zod'
import type { ApiErrorResponse } from './error-response'
import { HttpException } from './http-exceptions'
import { normalizeMongooseError } from './normalize-mongoose-error'
import { normalizeZodError } from './normalize-zod-error'

export function handleApiError(res: NextApiResponse, err: unknown) {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const normalized = normalizeZodError(err)
    const payload: ApiErrorResponse = {
      error: {
        code: 'validation_error',
        message: 'Validation error',
        details: normalized
      }
    }
    return res.status(400).json(payload)
  }

  // Handle HTTP exceptions (custom errors)
  if (err instanceof HttpException) {
    const payload: ApiErrorResponse = {
      error: { code: err.code, message: err.message, details: err.details }
    }
    return res.status(err.status).json(payload)
  }

  // Handle Mongoose/MongoDB errors
  const mongooseError = normalizeMongooseError(err)
  if (mongooseError) {
    const payload: ApiErrorResponse = {
      error: {
        code: mongooseError.code,
        message: mongooseError.message,
        details: mongooseError.details
      }
    }
    return res.status(mongooseError.status).json(payload)
  }

  // Log unexpected errors
  console.error('Unexpected error:', err)
  const payload: ApiErrorResponse = {
    error: { code: 'internal_error', message: 'Internal server error' }
  }
  return res.status(500).json(payload)
}
