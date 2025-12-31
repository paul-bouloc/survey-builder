export type ApiErrorCode =
  | 'bad_request'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'validation_error'
  | 'conflict'
  | 'unprocessable_entity'
  | 'too_many_requests'
  | 'internal_error'

export class HttpException extends Error {
  public readonly status: number
  public readonly code: ApiErrorCode
  public readonly details?: unknown

  constructor(opts: {
    status: number
    code: ApiErrorCode
    message?: string
    details?: unknown
  }) {
    super(opts.message ?? opts.code)
    this.name = this.constructor.name
    this.status = opts.status
    this.code = opts.code
    this.details = opts.details
  }
}

export class NotFoundException extends HttpException {
  constructor(message = 'Not found', details?: unknown) {
    super({ status: 404, code: 'not_found', message, details })
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized', details?: unknown) {
    super({ status: 401, code: 'unauthorized', message, details })
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = 'Forbidden', details?: unknown) {
    super({ status: 403, code: 'forbidden', message, details })
  }
}

export class BadRequestException extends HttpException {
  constructor(message = 'Bad request', details?: unknown) {
    super({ status: 400, code: 'bad_request', message, details })
  }
}

export class ConflictException extends HttpException {
  constructor(message = 'Conflict', details?: unknown) {
    super({ status: 409, code: 'conflict', message, details })
  }
}
