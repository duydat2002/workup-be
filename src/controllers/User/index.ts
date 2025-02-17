import { Request, Response } from 'express'
import User from '@/models/user'
import { checkFilesSize, checkFilesType } from '@/utils/checkFile'
import { deleteFileStorageByUrl, singleUpload } from '@/handlers/firebaseUpload'
import Label from '@/models/label'
import { Types } from 'mongoose'

const userController = {
  getUser: async (req: Request, res: Response) => {
    const user = await User.findById(req.userId, { password: 0 })

    if (!user) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Cannot found user.'
      })
    }

    return res.status(200).json({
      success: true,
      result: { user },
      message: 'Successfully get user.'
    })
  },
  findUserById: async (req: Request, res: Response) => {
    const { userId } = req.query

    const user = await User.findById(userId, { password: 0 })

    if (!user) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Cannot found user.'
      })
    }

    return res.status(200).json({
      success: true,
      result: { user },
      message: 'Successfully find user by id.'
    })
  },
  findUser: async (req: Request, res: Response) => {
    const { search } = req.query

    const user = await User.find(
      {
        $or: [
          { fullname: { $regex: search ?? '', $options: 'mi' } },
          { email: { $regex: search ?? '', $options: 'mi' } }
        ],
        emailVerified: true
      },
      { password: 0 }
    )

    if (!user) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Cannot found user.'
      })
    }

    return res.status(200).json({
      success: true,
      result: { user },
      message: 'Successfully find user.'
    })
  },
  updateInfo: async (req: Request, res: Response) => {
    const { fullname } = req.body

    const user = await User.findByIdAndUpdate(req.userId, { fullname }, { new: true, select: { password: 0 } })

    return res.status(200).json({
      success: true,
      result: { user },
      message: 'Successfully update user info.'
    })
  },
  updateAvatar: async (req: Request, res: Response) => {
    const checkFileType = checkFilesType([req.file], ['image'])

    if (!checkFileType.success) {
      return res.status(400).json({
        success: false,
        result: null,
        message: checkFileType.message
      })
    }

    const checkFileSize = checkFilesSize([req.file], 5 * 1024 * 1024)
    if (!checkFileSize.success) {
      return res.status(400).json({
        success: false,
        result: null,
        message: checkFileSize.message
      })
    }

    const avatarUpload = await singleUpload(req.file, `users/${req.userId}/avatar`)
    const avatarUrl = avatarUpload?.url

    const user = await User.findById(req.userId)

    const oldAvatar = user!.avatar
    user!.avatar = avatarUrl!

    await Promise.all([user!.save(), deleteFileStorageByUrl(oldAvatar)])

    return res.status(200).json({
      success: true,
      result: { avatar: null },
      message: 'Successfully update user avatar.'
    })
  },
  deleteAvatar: async (req: Request, res: Response) => {
    const user = await User.findByIdAndUpdate(req.userId, {
      avatar: ''
    })

    if (user) await deleteFileStorageByUrl(user.avatar)

    return res.status(200).json({
      success: true,
      result: null,
      message: 'Successfully delete user avatar.'
    })
  },
  //User Labels
  getUserLabels: async (req: Request, res: Response) => {
    const user = await User.findById(req.userId).populate('userLabels')

    const userLabels = user!.userLabels.sort((a: any, b: any) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    )

    return res.status(200).json({
      success: true,
      result: { userLabels },
      message: 'Successfully get user labels.'
    })
  },
  createUserLabel: async (req: Request, res: Response) => {
    const { name, color } = req.body

    const checkExist = await Label.findOne({
      ownerId: req.userId,
      name,
      color
    })

    if (checkExist) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Label already exist.'
      })
    }

    const newLabel = await new Label({
      name: name,
      color: color,
      ownerType: 'User',
      ownerId: req.userId
    }).save()

    await User.findByIdAndUpdate(
      req.userId,
      {
        $addToSet: { userLabels: newLabel.id }
      },
      { new: true }
    )

    return res.status(200).json({
      success: true,
      result: { label: newLabel },
      message: 'Successfully create user label.'
    })
  },
  updateUserLabel: async (req: Request, res: Response) => {
    const { name, color } = req.body
    const labelId = req.params.labelId
    const userId = new Types.ObjectId(req.userId)

    const checkExist = await Label.findOne({
      _id: { $ne: labelId },
      ownerId: userId,
      name,
      color
    })

    if (checkExist) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Label already exist.'
      })
    }

    const updatedLabel = await Label.findByIdAndUpdate(
      labelId,
      {
        name,
        color
      },
      { new: true }
    )

    return res.status(200).json({
      success: true,
      result: { label: updatedLabel },
      message: 'Successfully update user label.'
    })
  },
  deleteUserLabel: async (req: Request, res: Response) => {
    const labelId = req.params.labelId

    const label = await Label.findOneAndDelete({ _id: labelId })

    if (!label) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Cannot found this label.'
      })
    }

    return res.status(200).json({
      success: true,
      result: null,
      message: 'Successfully delete user label.'
    })
  }
}

export default userController
