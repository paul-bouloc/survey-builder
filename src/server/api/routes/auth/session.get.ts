import { createEndpoint } from '@/server/api/create-endpoint'
import { SessionResponseSchema } from '@/shared/api/contracts/auth.contract'

export const getSession = createEndpoint(
  {
    requireAuth: true,
    response: SessionResponseSchema
  },
  async ({ user }) => {
    return {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }
)
