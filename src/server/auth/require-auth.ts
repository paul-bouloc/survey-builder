import { UnauthorizedException } from '@/server/api/errors'
import { User } from '@/server/models'
import type { IUserDocument } from '@/server/models/user/user.document'
import type { NextApiRequest } from 'next'
import { getTokenFromRequest, verifyToken } from './jwt'

export interface AuthenticatedRequest extends NextApiRequest {
  user?: IUserDocument
}

export async function requireAuth(req: AuthenticatedRequest): Promise<void> {
  const token = getTokenFromRequest(req.cookies)

  if (!token) {
    throw new UnauthorizedException('Authentication required')
  }

  try {
    const payload = verifyToken(token)

    const user = await User.findById(payload.userId)

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    req.user = user
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error
    }
    throw new UnauthorizedException(
      error instanceof Error ? error.message : 'Invalid token'
    )
  }
}
