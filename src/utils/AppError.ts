// src/utils/AppError.ts
// Throw this anywhere to produce a clean HTTP error response.
//
// throw new AppError('User not found', 404)
// throw new AppError('Email already in use', 409)

export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true

    Object.setPrototypeOf(this, AppError.prototype)
    Error.captureStackTrace(this, this.constructor)
  }
}
