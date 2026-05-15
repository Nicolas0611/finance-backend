// src/services/commentService.ts
import { commentRepository } from '@/repositories/commentRepository'
import { AppError } from '@/utils/AppError'
import { AuthUser } from '@/types'
import { CreateCommentInput } from '@/validators/commentValidators'

export const commentService = {
  getByPost: (postId: string) =>
    commentRepository.findByPost(postId),

  create: (data: CreateCommentInput, postId: string, authorId: string) =>
    commentRepository.create({ ...data, postId, authorId }),

  remove: async (id: string, requestingUser: AuthUser) => {
    const comment = await commentRepository.findById(id)
    if (!comment) throw new AppError('Comment not found', 404)

    // Business rule: only the author or an admin can delete
    const isOwner = comment.author.id === requestingUser.id
    const isAdmin = requestingUser.role === 'ADMIN'
    if (!isOwner && !isAdmin) throw new AppError('Forbidden', 403)

    return commentRepository.remove(id)
  },
}
