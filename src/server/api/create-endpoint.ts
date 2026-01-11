import { handleApiError, InternalServerException } from '@/server/api/errors'
import type { AuthenticatedRequest } from '@/server/auth/require-auth'
import { requireAuth } from '@/server/auth/require-auth'
import connectDB from '@/server/database/mongoose'
import type { IUserDocument } from '@/server/models/user/user.document'
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import type { z, ZodType } from 'zod'

type Infer<S extends ZodType | undefined> = S extends ZodType
  ? z.infer<S>
  : undefined

type EndpointConfig<
  TBody extends ZodType | undefined,
  TQuery extends ZodType | undefined,
  TRes extends ZodType | undefined,
  TRequireAuth extends boolean | undefined
> = {
  /**
   * The body schema of the endpoint. This will be parsed from the request body.
   */
  body?: TBody
  /**
   * The query schema of the endpoint. This will be parsed from the request query.
   */
  query?: TQuery
  /**
   * The response schema of the endpoint. This will be parsed from the response.
   */
  response?: TRes
  /**
   * HTTP status returned on success.
   * Default: 200
   */
  status?: number
  /**
   * Connect to DB before calling handler.
   * Default: true
   */
  withDb?: boolean
  /**
   * Require authentication for this endpoint.
   * Default: true (set to false for public endpoints like login)
   */
  requireAuth?: TRequireAuth
}

// Type conditionnel pour déterminer le type de req selon requireAuth
type RequestType<TRequireAuth extends boolean | undefined> =
  TRequireAuth extends false ? NextApiRequest : AuthenticatedRequest

// Type conditionnel pour le contexte du handler
type HandlerContext<
  TBody extends ZodType | undefined,
  TQuery extends ZodType | undefined,
  TRequireAuth extends boolean | undefined
> = {
  req: RequestType<TRequireAuth>
  res: NextApiResponse
  body: Infer<TBody>
  query: Infer<TQuery>
} & (TRequireAuth extends false
  ? Record<string, never>
  : {
      user: IUserDocument
    })

export function createEndpoint<
  TBody extends ZodType | undefined = undefined,
  TQuery extends ZodType | undefined = undefined,
  TRes extends ZodType | undefined = undefined,
  TRequireAuth extends boolean | undefined = undefined
>(
  config: EndpointConfig<TBody, TQuery, TRes, TRequireAuth>,
  handler: (
    ctx: HandlerContext<TBody, TQuery, TRequireAuth>
  ) =>
    | Promise<Infer<TRes> extends undefined ? unknown : Infer<TRes>>
    | (Infer<TRes> extends undefined ? unknown : Infer<TRes>)
): NextApiHandler {
  return async (req, res) => {
    try {
      const body = (
        config.body ? config.body.parse(req.body) : undefined
      ) as Infer<TBody>
      const query = (
        config.query ? config.query.parse(req.query) : undefined
      ) as Infer<TQuery>

      if (config.withDb ?? true) {
        await connectDB()
      }

      let user: IUserDocument | undefined = undefined
      if (config.requireAuth !== false) {
        await requireAuth(req as AuthenticatedRequest)
        const { user: authenticatedUser } = req as AuthenticatedRequest
        user = authenticatedUser
        if (!user) {
          throw new InternalServerException(
            'User not found after authentication'
          )
        }
      }

      const baseCtx = {
        req: req as RequestType<TRequireAuth>,
        res,
        body,
        query
      }

      const ctx = (user ? { ...baseCtx, user } : baseCtx) as HandlerContext<
        TBody,
        TQuery,
        TRequireAuth
      >

      const result = await handler(ctx)

      const payload = config.response ? config.response.parse(result) : result

      return res.status(config.status ?? 200).json(payload)
    } catch (e) {
      return handleApiError(res, e)
    }
  }
}
