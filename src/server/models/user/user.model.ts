import { IUserDocument, UserModel } from '@/server/models/user/user.document'
import { UserSchema } from '@/server/models/user/user.schema'
import { model, models } from 'mongoose'

export const User: UserModel =
  (models.User as UserModel) ||
  model<IUserDocument, UserModel>('User', UserSchema)

export default User
