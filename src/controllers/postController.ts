// src/controllers/postController.ts
import { Request, Response, NextFunction } from 'express'
import { postService } from '@/services/postService'
import { sendSuccess, sendCreated } from '@/utils/response'

export const postController = {
  getAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const isAdmin = req.user?.role === 'ADMIN'
      const posts = isAdmin ? await postService.getAll() : await postService.getAllPublished()
      sendSuccess(res, { posts })
    } catch (err) {
      next(err)
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const post = await postService.getById(req.params.id)
      sendSuccess(res, { post })
    } catch (err) {
      next(err)
    }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const post = await postService.create(req.body, req.user!.id)
      sendCreated(res, { post })
    } catch (err) {
      next(err)
    }
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const post = await postService.update(req.params.id, req.body, req.user!)
      sendSuccess(res, { post })
    } catch (err) {
      next(err)
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await postService.remove(req.params.id, req.user!)
      sendSuccess(res, { message: 'Post deleted' })
    } catch (err) {
      next(err)
    }
  },
}
