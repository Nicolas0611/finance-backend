// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import { AppError } from '@/utils/AppError'

const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError): AppError => {
  if (err.code === 'P2002') {
    const field = (err.meta?.target as string[])?.[0] ?? 'field'
    return new AppError(`${field} already exists`, 409)
  }
  if (err.code === 'P2025') {
    return new AppError('Record not found', 404)
  }
  return new AppError('Database error', 500)
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  let error: AppError

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error = handlePrismaError(err)
  } else if (err instanceof AppError) {
    error = err
  } else {
    error = new AppError('Something went wrong', 500)
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err)
  }

  return res.status(error.statusCode).json({
    success: false,
    message: error.isOperational ? error.message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
