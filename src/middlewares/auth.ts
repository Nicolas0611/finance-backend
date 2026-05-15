// src/middlewares/auth.ts
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '@/config/app'
import { AppError } from '@/utils/AppError'
import prisma from '@/config/database'
import { JwtPayload } from '@/types'

// Verifies JWT and attaches the user to req.user
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401)
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true },
    })

    if (!user) throw new AppError('User no longer exists', 401)

    req.user = user // TypeScript knows the shape because of express.d.ts
    next()
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) return next(new AppError('Invalid token', 401))
    if (err instanceof jwt.TokenExpiredError) return next(new AppError('Token expired', 401))
    next(err)
  }
}

// Restricts to specific roles — must come after authenticate
export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission', 403))
    }
    next()
  }
}
