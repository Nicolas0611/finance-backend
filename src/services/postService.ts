// src/services/postService.ts
import { postRepository } from '@/repositories/postRepository'
import { AppError } from '@/utils/AppError'
import { AuthUser } from '@/types'
import { CreatePostInput, UpdatePostInput } from '@/validators/postValidators'

export const postService = {
  getAllPublished: () =>
    postRepository.findAll({ published: true }),

  getAll: () =>
    postRepository.findAll(),

  getById: async (id: string) => {
    const post = await postRepository.findById(id)
    if (!post) throw new AppError('Post not found', 404)
    return post
  },

  create: (data: CreatePostInput, authorId: string) =>
    postRepository.create({ ...data, authorId }),

  update: async (id: string, data: UpdatePostInput, requestingUser: AuthUser) => {
    const post = await postRepository.findById(id)
    if (!post) throw new AppError('Post not found', 404)

    const isOwner = post.author.id === requestingUser.id
    const isAdmin = requestingUser.role === 'ADMIN'
    if (!isOwner && !isAdmin) throw new AppError('Forbidden', 403)

    return postRepository.update(id, data)
  },

  remove: async (id: string, requestingUser: AuthUser) => {
    const post = await postRepository.findById(id)
    if (!post) throw new AppError('Post not found', 404)

    const isOwner = post.author.id === requestingUser.id
    const isAdmin = requestingUser.role === 'ADMIN'
    if (!isOwner && !isAdmin) throw new AppError('Forbidden', 403)

    return postRepository.remove(id)
  },
}
