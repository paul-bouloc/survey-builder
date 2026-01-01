import { createEndpoint } from '@/server/api/create-endpoint'
import { clearAuthCookie } from '@/server/auth/cookies'
import { z } from 'zod'

export const postLogout = createEndpoint(
  {
    requireAuth: false,
    response: z.object({
      success: z.boolean()
    })
  },
  async ({ res }) => {
    clearAuthCookie(res)

    return {
      success: true
    }
  }
)
