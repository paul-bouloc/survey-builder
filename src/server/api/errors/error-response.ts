import { ApiErrorCode } from './http-exceptions'

export type ApiErrorResponse = {
  error: {
    code: ApiErrorCode
    message: string
    details?: unknown
  }
}
