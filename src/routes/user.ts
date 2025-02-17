import express from 'express'
import userController from '@/controllers/User'
import { isAuthenticated } from '@/middlewares/auth'
import { handleErrors } from '@/handlers/errorHandler'
import upload from '@/handlers/firebaseUpload'
import { validateData } from '@/middlewares/validation'
import { labelSchema } from '@/validations/user'

const router = express.Router()

router.get('/get', isAuthenticated, handleErrors(userController.getUser))
router.get('/find', handleErrors(userController.findUser))
router.get('/find-by-id', handleErrors(userController.findUserById))
router.patch('/update-info', isAuthenticated, handleErrors(userController.updateInfo))
router.patch('/update-avatar', isAuthenticated, upload.single('avatar'), handleErrors(userController.updateAvatar))
router.delete('/delete-avatar', isAuthenticated, handleErrors(userController.deleteAvatar))
//User Labels
router.get('/labels', isAuthenticated, handleErrors(userController.getUserLabels))
router.post('/labels', isAuthenticated, validateData(labelSchema), handleErrors(userController.createUserLabel))
router.patch('/labels/:labelId', isAuthenticated, handleErrors(userController.updateUserLabel))
router.delete('/labels/:labelId', isAuthenticated, handleErrors(userController.deleteUserLabel))

export default router
