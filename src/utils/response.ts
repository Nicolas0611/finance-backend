// src/utils/response.ts
import { Response } from 'express'

// Every success response: { success: true, data: {...} }
export const sendSuccess = <T>(res: Response, data: T, statusCode = 200): Response => {
  return res.status(statusCode).json({ success: true, data })
}

export const sendCreated = <T>(res: Response, data: T): Response => {
  return sendSuccess(res, data, 201)
}

// Every error response: { success: false, message: '...' }
export const sendError = (res: Response, message: string, statusCode = 500): Response => {
  return res.status(statusCode).json({ success: false, message })
}
