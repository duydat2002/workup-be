import { Request, Response } from 'express'
import User from '@/models/user'
import { Types } from 'mongoose'

const userController = {
  getUser: async (req: Request, res: Response) => {
    const user = await User.findById(req.userId)

    if (!user) {
      res.status(400).json({
        success: false,
        result: null,
        message: 'Cannot found user.'
      })
      return
    }

    res.status(200).json({
      success: true,
      result: { user },
      message: 'Successfully get user.'
    })
  }
}

export default userController
