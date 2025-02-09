import { Request, Response } from 'express'
import User from '@/models/user'
import generateOTP from '@/utils/generateOTP'
import moment from 'moment'
import { sendForgotPasswordMail, sendVerificationOTPMail } from '@/mails/auth'

const authController = {
  signUpWithEmail: async (req: Request, res: Response) => {
    const { email, password, fullname } = req.body

    const existUser = await User.findOne({ email })
    if (existUser)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'The account is already existed.'
      })

    const user = await new User({
      email,
      password,
      fullname
    }).save()

    return res.status(200).json({
      success: true,
      result: { user },
      message: 'Successfully create user.'
    })
  },
  signIn: async (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      result: { user: req.user },
      message: 'Successfully signin.'
    })
  },
  signInWithGoogle: async (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      result: null,
      message: 'Successfully signin with Google.'
    })
  },
  setPassword: async (req: Request, res: Response) => {
    const { password } = req.body

    const user = await User.findOne({ email: req.user?.email })
    user!.password = password
    await user!.save()

    return res.status(200).json({
      success: true,
      result: null,
      message: 'Successfully set password.'
    })
  },
  sendVerificationOTP: async (req: Request, res: Response) => {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'User not found.'
      })

    if (user.emailVerified)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Email already verified.'
      })

    const otp = generateOTP()
    user.verificationOtp = otp
    user.verificationOtpExpires = moment().add(15, 'm').toDate()
    await user.save()

    await sendVerificationOTPMail(email, user.fullname, otp)

    return res.status(200).json({
      success: true,
      result: null,
      message: 'Successfully send verification OTP.'
    })
  },
  verificationEmail: async (req: Request, res: Response) => {
    const { email, token } = req.query

    const user = await User.findOne({ email })
    if (!user)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'User not found.'
      })

    if (user.emailVerified)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Email already verified.'
      })

    if (user.verificationOtp != token)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid verification code.'
      })

    if (user.verificationOtpExpires && user.verificationOtpExpires < new Date())
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Verification code expired.'
      })

    user.emailVerified = true
    user.verificationOtp = ''
    user.verificationOtpExpires = null
    await user.save()

    return res.status(200).json({
      success: true,
      result: null,
      message: 'Successfully verification email.'
    })
  },
  changePassword: async (req: Request, res: Response) => {
    const { password, newPassword } = req.body

    const user = await User.findOne({ email: req.user?.email })
    if (!user!.verifyPassword(password))
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Incorrect password.'
      })

    user!.password = newPassword
    await user!.save()

    return res.status(200).json({
      success: true,
      result: null,
      message: 'Successfully set password.'
    })
  },
  sendResetPassword: async (req: Request, res: Response) => {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'User not found.'
      })

    const otp = generateOTP()
    user.verificationOtp = otp
    user.verificationOtpExpires = moment().add(15, 'm').toDate()
    await user.save()

    await sendForgotPasswordMail(email, user.fullname, otp)

    return res.status(200).json({
      success: true,
      result: null,
      message: 'Successfully send password reset.'
    })
  },
  resetPassword: async (req: Request, res: Response) => {
    const { email, pasword, token } = req.body

    const user = await User.findOne({ email })
    if (!user)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'User not found.'
      })

    if (user.verificationOtp != token)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid verification code.'
      })

    if (user.verificationOtpExpires && user.verificationOtpExpires < new Date())
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Verification code expired.'
      })

    user.password = pasword as string
    user.verificationOtp = ''
    user.verificationOtpExpires = null
    await user.save()

    return res.status(200).json({
      success: true,
      result: null,
      message: 'Successfully reset password.'
    })
  },
  signOut: async (req: Request, res: Response) => {
    req.logout(() => {
      return res.status(200).json({ success: true, result: null, message: 'Successfully signout.' })
    })
  }
}

export default authController
