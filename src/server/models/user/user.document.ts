import { Model, Types } from 'mongoose'

export interface IUserDocument extends Document {
  _id: Types.ObjectId
  shortId: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export type UserModel = Model<IUserDocument>
