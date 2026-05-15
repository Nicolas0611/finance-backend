// src/routes/authRoutes.ts
import { Router } from 'express'
import { authController } from '@/controllers/authController'
import { authenticate } from '@/middlewares/auth'
import { validate } from '@/middlewares/validate'
import { registerSchema, loginSchema } from '@/validators/authValidators'

const router = Router()

router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)
router.get('/me', authenticate, authController.getMe)

export default router
