import { generateShortId } from '@/lib/string'
import {
  Schema,
  model,
  models,
  type Document,
  type Model,
  type Types
} from 'mongoose'

export interface IUserDocument extends Document {
  _id: Types.ObjectId
  shortId: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

type UserModel = Model<IUserDocument>

const UserSchema = new Schema<IUserDocument, UserModel>(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: generateShortId,
      validate: {
        validator: (v: string) => v.length === 6,
        message: 'shortId must be exactly 6 characters'
      }
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      index: true
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must not exceed 100 characters']
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
)

UserSchema.pre('save', async function () {
  if (!this.shortId || this.shortId.length !== 6) {
    let newShortId: string
    let isUnique = false
    let attempts = 0
    const maxAttempts = 10

    const UserModel = this.db.models.User || this.constructor

    while (!isUnique && attempts < maxAttempts) {
      newShortId = generateShortId()
      const existing = await UserModel.findOne({ shortId: newShortId })
      if (!existing) {
        isUnique = true
        this.shortId = newShortId
      }
      attempts++
    }

    if (!isUnique) {
      throw new Error(
        'Failed to generate unique shortId after multiple attempts'
      )
    }
  }
})

UserSchema.index({ email: 1 })
UserSchema.index({ shortId: 1 })

export const User: UserModel =
  (models.User as UserModel) ||
  model<IUserDocument, UserModel>('User', UserSchema)

export default User
