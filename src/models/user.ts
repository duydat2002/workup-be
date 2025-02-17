import { hashPassword, verifyPassword } from '@/utils/bcrypt'
import mongoose, { Document } from 'mongoose'
import autopopulate from 'mongoose-autopopulate'

const { Schema } = mongoose

export type UserDocument = Document & {
  fullname: string
  email: string
  password: string
  googleId: string
  avatar: string
  emailVerified: boolean
  verificationOtp: string
  verificationOtpExpires: Date | null
  userLabels: string[]
  verifyPassword(candidatePassword: string): boolean
}

const UserSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    googleId: {
      type: String
    },
    avatar: {
      type: String,
      default: ''
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    verificationOtp: {
      type: String,
      default: ''
    },
    verificationOtpExpires: {
      type: Date,
      default: null
    },
    userLabels: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Label'
      }
    ]
  },
  { timestamps: true }
)

UserSchema.plugin(autopopulate)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  try {
    this.password = hashPassword(this.password)
    next()
  } catch (error) {
    return next(error as Error)
  }
})

UserSchema.methods.verifyPassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false
  return verifyPassword(candidatePassword, this.password)
}

const User = mongoose.model<UserDocument>('User', UserSchema)

export default User
