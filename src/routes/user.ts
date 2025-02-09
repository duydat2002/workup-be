import express from 'express'
import userController from '@/controllers/User'

const router = express.Router()

router.get('/get', userController.getUser)

export default router
