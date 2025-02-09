import { Request, Response, NextFunction } from 'express'
import { z, ZodError } from 'zod'

export function validateData(schema: z.ZodObject<any, any>, source: 'body' | 'query' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(source == 'body' ? req.body : req.query)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join('.')}: ${issue.message}`
        }))
        res.status(400).json({
          success: false,
          result: null,
          message: 'Invalid data',
          error: errorMessages
        })
      } else {
        res.status(500).json({ success: false, result: null, message: 'Internal Server Error' })
      }
    }
  }
}
