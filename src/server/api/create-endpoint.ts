import { handleApiError } from '@/server/api/errors'
import connectDB from '@/server/database/mongoose'
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import type { z, ZodType } from 'zod'

type Infer<S extends ZodType | undefined> = S extends ZodType
  ? z.infer<S>
  : undefined

type EndpointConfig<
  TBody extends ZodType | undefined,
  TQuery extends ZodType | undefined,
  TRes extends ZodType | undefined
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
}

export function createEndpoint<
  TBody extends ZodType | undefined = undefined,
  TQuery extends ZodType | undefined = undefined,
  TRes extends ZodType | undefined = undefined
>(
  config: EndpointConfig<TBody, TQuery, TRes>,
  handler: (ctx: {
    req: NextApiRequest
    res: NextApiResponse
    body: Infer<TBody>
    query: Infer<TQuery>
  }) =>
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

      const result = await handler({ req, res, body, query })

      const payload = config.response ? config.response.parse(result) : result

      return res.status(config.status ?? 200).json(payload)
    } catch (e) {
      return handleApiError(res, e)
    }
  }
}
