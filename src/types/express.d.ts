/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Types } from 'mongoose'
import { Profile } from 'passport-google-oauth20'
import { UserDocument } from '@/models/user'

declare global {
  namespace Express {
    interface Request {
      user?: Profile
      userId?: string | Types.ObjectId
    }
    interface User extends UserDocument {}
  }
}
