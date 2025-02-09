import express from 'express'
import authController from '@/controllers/Auth'
import { validateData } from '@/middlewares/validation'
import { isAuthenticated } from '@/middlewares/auth'
import {
  changePasswordSchema,
  confirmResetPasswordSchema,
  confirmVefifyTokenSchema,
  emailSchema,
  passwordSchema,
  signInSchema,
  signUpSchema
} from '@/validations/auth'
import { handleErrors } from '@/handlers/errorHandler'
import passport from '@/configs/passport'

const router = express.Router()

router.post('/signin', validateData(signInSchema), passport.authenticate('local'), handleErrors(authController.signIn))
router.post('/email', validateData(signUpSchema), handleErrors(authController.signUpWithEmail))
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate('google'), handleErrors(authController.signInWithGoogle))
router.post('/set-password', isAuthenticated, validateData(passwordSchema), handleErrors(authController.setPassword))
router.post(
  '/change-password',
  isAuthenticated,
  validateData(changePasswordSchema),
  handleErrors(authController.changePassword)
)
router.post('/verify/send', validateData(emailSchema), handleErrors(authController.sendVerificationOTP))
router.get(
  '/verify/confirm',
  validateData(confirmVefifyTokenSchema, 'query'),
  handleErrors(authController.verificationEmail)
)
router.post('/reset/send', validateData(emailSchema), handleErrors(authController.sendResetPassword))
router.post('/reset/confirm', validateData(confirmResetPasswordSchema), handleErrors(authController.resetPassword))

router.post('/signout', handleErrors(authController.signOut))

export default router
