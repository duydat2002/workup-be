import { Request, Response, NextFunction } from 'express'

export const handleErrors = (fn: any) => {
  return function (req: Request, res: Response, next: NextFunction) {
    return fn(req, res, next).catch((error: any) => {
      console.log(error?.message)
      // Cast error
      if (error.name == 'CastError') {
        return res.status(400).json({
          success: false,
          result: null,
          message: 'Id is invalid.',
          keyValue: 'id',
          error: error
        })
      }

      // Custom error
      if (error.name == 'MyError') {
        return res.status(400).json({
          success: false,
          result: null,
          message: error.message,
          error: error,
          keyValue: error.keyValue
        })
      }

      //Validation error
      if (error.name == 'ValidationError') {
        const keyValue = Object.keys(error.errors)
        const messages = Object.values(error.errors).map((err: any) => ({
          name: err.path,
          message: err.name == 'CastError' ? 'Id is invalid.' : err.message
        }))

        return res.status(400).json({
          success: false,
          result: null,
          message: messages,
          keyValue,
          error: error
        })
      }

      // Duplicate error
      if (error.code == 11000) {
        const keyValue = Object.keys(error.keyValue || {})[0]
        return res.status(500).json({
          success: false,
          result: null,
          message: `This ${keyValue} already exists.`,
          keyValue,
          error: error
        })
      }

      // console.log(error);
      // Server error
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Something went wrong.',
        error: error,
        errorMessage: error?.message
      })
    })
  }
}
