import { sendMail } from '.'

export const sendVerificationOTPMail = async (email: string, name: string, otp: string) => {
  const verificationLink = `http://localhost:3000/api/auth/verify/confirm?email=${email}&token=${otp}`

  await sendMail(email, 'Email Verification', 'verificationEmail', {
    name,
    verificationLink
  })
}

export const sendForgotPasswordMail = async (email: string, name: string, otp: string) => {
  const verificationLink = `http://localhost:3000/api/auth/forgot/confirm?email=${email}&token=${otp}`

  await sendMail(email, 'Password Reset', 'passwordResetEmail', {
    name,
    verificationLink
  })
}
