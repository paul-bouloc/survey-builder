import bcrypt from 'bcryptjs'
import {
  Schema,
  model,
  models,
  type Document,
  type Model,
  type Types
} from 'mongoose'

export interface IUser extends Document {
  _id: Types.ObjectId
  email: string
  firstName: string
  lastName: string
  password: string
  emailVerified: boolean
  acceptTerms: boolean
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>
}

type UserModel = Model<IUser, Record<string, never>, IUserMethods>

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      index: true
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [50, 'First name must not exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [50, 'Last name must not exceed 50 characters']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [10, 'Password must be at least 10 characters'],
      maxlength: [128, 'Password must not exceed 128 characters'],
      select: false // Don't include password in queries by default
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    acceptTerms: {
      type: Boolean,
      required: [true, 'You must accept the terms and conditions'],
      default: false
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
)

// Hash password before saving
UserSchema.pre('save', async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return
  }

  // Hash password with cost of 12
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
})

// Method to compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Create index on email for faster lookups
UserSchema.index({ email: 1 })

// Export the model
export const User: UserModel =
  (models.User as UserModel) || model<IUser, UserModel>('User', UserSchema)

export default User
