// src/controllers/commentController.ts
import { Request, Response, NextFunction } from 'express'
import { commentService } from '@/services/commentService'
import { sendSuccess, sendCreated } from '@/utils/response'

export const commentController = {
  getByPost: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const comments = await commentService.getByPost(req.params.postId)
      sendSuccess(res, { comments })
    } catch (err) {
      next(err)
    }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const comment = await commentService.create(req.body, req.params.postId, req.user!.id)
      sendCreated(res, { comment })
    } catch (err) {
      next(err)
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await commentService.remove(req.params.id, req.user!)
      sendSuccess(res, { message: 'Comment deleted' })
    } catch (err) {
      next(err)
    }
  },
}
