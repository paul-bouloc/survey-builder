import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export function createRoute(
  handlers: Partial<Record<Method, NextApiHandler>>
): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method as Method | undefined
    const handler = method ? handlers[method] : undefined

    if (!handler) {
      res.setHeader('Allow', Object.keys(handlers))
      return res.status(405).json({
        error: { code: 'method_not_allowed', message: 'Method not allowed' }
      })
    }

    return handler(req, res)
  }
}
