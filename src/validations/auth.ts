import { z } from 'zod'

export const passwordSchema = z.object({
  password: z.string().min(8)
})

export const emailSchema = z.object({
  email: z.string().email()
})

export const otpSchema = z.object({
  otp: z.string()
})

export const signUpSchema = emailSchema.merge(passwordSchema).extend({
  fullname: z.string()
})

export const signInSchema = emailSchema.merge(passwordSchema)

export const changePasswordSchema = passwordSchema.extend({
  newPassword: z.string().min(8)
})

export const confirmVefifyTokenSchema = emailSchema.extend({
  token: z.string()
})
