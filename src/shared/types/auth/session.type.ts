import { Email, ObjectId } from '@/shared/types/brands.type'

export interface Session {
  userId: ObjectId
  email: Email
  name: string
  createdAt: Date
  updatedAt: Date
}
