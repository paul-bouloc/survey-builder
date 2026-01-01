import { Email, ObjectId, ShortId } from '@/shared/types/brands.type'

export interface IUser {
  _id: ObjectId
  shortId: ShortId
  email: Email
  name: string
  createdAt: Date
  updatedAt: Date
}
