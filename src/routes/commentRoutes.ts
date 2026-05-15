// src/routes/commentRoutes.ts
import { Router } from 'express'
import { commentController } from '@/controllers/commentController'
import { authenticate } from '@/middlewares/auth'
import { validate } from '@/middlewares/validate'
import { createCommentSchema } from '@/validators/commentValidators'

// mergeParams: true gives access to :postId from the parent route
const router = Router({ mergeParams: true })

router.get('/', commentController.getByPost)
router.post('/', authenticate, validate(createCommentSchema), commentController.create)
router.delete('/:id', authenticate, commentController.remove)

export default router
