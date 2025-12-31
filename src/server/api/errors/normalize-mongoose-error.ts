import type { Error as MongooseError } from 'mongoose'
import { BadRequestException, ConflictException } from './http-exceptions'

interface MongoServerError extends Error {
  code?: number
  keyPattern?: Record<string, number>
  keyValue?: Record<string, unknown>
}

/**
 * Normalize Mongoose errors to HTTP exceptions
 */
export function normalizeMongooseError(
  error: unknown
): BadRequestException | ConflictException | null {
  // Check if it's a Mongoose ValidationError
  if (
    error &&
    typeof error === 'object' &&
    'name' in error &&
    error.name === 'ValidationError'
  ) {
    const validationError = error as MongooseError.ValidationError
    const fieldErrors: Record<string, string[]> = {}

    // Extract field errors
    if (validationError.errors) {
      for (const [field, err] of Object.entries(validationError.errors)) {
        if (err instanceof Error) {
          fieldErrors[field] = [err.message]
        }
      }
    }

    return new BadRequestException('Validation error', {
      messages: [validationError.message],
      fieldErrors
    })
  }

  // Check if it's a Mongoose CastError
  if (
    error &&
    typeof error === 'object' &&
    'name' in error &&
    error.name === 'CastError'
  ) {
    const castError = error as MongooseError.CastError
    return new BadRequestException(
      `Invalid ${castError.kind} for field ${castError.path}`,
      {
        path: castError.path,
        kind: castError.kind,
        value: castError.value
      }
    )
  }

  // Check if it's a MongoDB duplicate key error (MongoServerError)
  // Error code 11000 = E11000 duplicate key error
  const mongoError = error as MongoServerError
  if (
    mongoError &&
    typeof mongoError === 'object' &&
    (mongoError.code === 11000 ||
      mongoError.name === 'MongoServerError' ||
      mongoError.name === 'MongoError')
  ) {
    // Extract the field that caused the duplicate
    const duplicateField = mongoError.keyPattern
      ? Object.keys(mongoError.keyPattern)[0]
      : 'field'
    const duplicateValue = mongoError.keyValue
      ? mongoError.keyValue[duplicateField]
      : undefined

    // Generate a user-friendly message
    const fieldName = duplicateField === 'email' ? 'Email' : duplicateField
    const message =
      duplicateValue !== undefined
        ? `${fieldName} "${duplicateValue}" already exists`
        : `${fieldName} already exists`

    return new ConflictException(message, {
      field: duplicateField,
      value: duplicateValue
    })
  }

  // Return null if it's not a Mongoose/MongoDB error we can handle
  return null
}
