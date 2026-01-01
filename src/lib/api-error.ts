import type { ApiErrorResponse } from '@/server/api/errors'
import { AxiosError } from 'axios'

/**
 * Extracts API error from an AxiosError
 * @param error - The error to extract from
 * @returns The API error or null if not an API error
 */
export function extractApiError(
  error: unknown
): ApiErrorResponse['error'] | null {
  if (!(error instanceof AxiosError)) {
    return null
  }

  const apiError = error.response?.data as ApiErrorResponse | undefined
  return apiError?.error ?? null
}

/**
 * Gets the error message from an error, with fallback
 * @param error - The error to extract message from
 * @param fallback - Fallback message if no error message found
 * @returns The error message
 */
export function getErrorMessage(
  error: unknown,
  fallback = 'An error occurred'
): string {
  const apiError = extractApiError(error)
  return apiError?.message ?? fallback
}
