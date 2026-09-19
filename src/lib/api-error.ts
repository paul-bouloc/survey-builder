import type { ApiErrorResponse } from '@/server/api/errors'
import { AxiosError } from 'axios'

export function extractApiError(
  error: unknown
): ApiErrorResponse['error'] | null {
  if (!(error instanceof AxiosError)) {
    return null
  }

  const apiError = error.response?.data as ApiErrorResponse | undefined
  return apiError?.error ?? null
}

export function getErrorMessage(
  error: unknown,
  fallback = 'An error occurred'
): string {
  const apiError = extractApiError(error)
  return apiError?.message ?? fallback
}

export function isRetriableApiError(error: unknown): boolean {
  if (!(error instanceof AxiosError)) return false

  if (!error.response) return true

  return error.response.status >= 500
}
