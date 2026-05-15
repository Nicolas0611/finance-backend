// src/middlewares/validate.ts
import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

// Generic: works with any Zod schema
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }))

      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      })
      return
    }

    req.body = result.data
    next()
  }
}
