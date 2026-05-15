// src/validators/postValidators.ts
import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().optional(),
  published: z.boolean().optional().default(false),
})

export const updatePostSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().optional(),
  published: z.boolean().optional(),
})

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
