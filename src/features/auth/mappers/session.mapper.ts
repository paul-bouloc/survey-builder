import type { SessionResponse } from '@/shared/api/contracts/auth/auth.contract'
import type { Session } from '@/shared/types/auth/session.type'
import type { Email, ObjectId } from '@/shared/types/brands.type'

export const sessionMapper = {
  toDomain(session: SessionResponse): Session {
    return {
      userId: session.userId as ObjectId,
      email: session.email as Email,
      name: session.name,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt)
    }
  }
}
