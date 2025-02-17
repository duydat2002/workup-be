import { NextFunction, Request, Response } from 'express'

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    req.userId = req.user.id
    return next()
  }
  res.status(401).json({
    success: false,
    result: null,
    message: 'Unauthorized.'
  })
}
