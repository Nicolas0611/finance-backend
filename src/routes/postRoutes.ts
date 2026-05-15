// src/routes/postRoutes.ts
import { Router } from 'express'
import { postController } from '@/controllers/postController'
import { authenticate } from '@/middlewares/auth'
import { validate } from '@/middlewares/validate'
import { createPostSchema, updatePostSchema } from '@/validators/postValidators'

const router = Router()

router.get('/', postController.getAll)
router.get('/:id', postController.getById)
router.post('/', authenticate, validate(createPostSchema), postController.create)
router.patch('/:id', authenticate, validate(updatePostSchema), postController.update)
router.delete('/:id', authenticate, postController.remove)

export default router
