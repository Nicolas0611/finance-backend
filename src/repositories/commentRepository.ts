// src/repositories/commentRepository.ts
import prisma from '@/config/database'

const authorSelect = { select: { id: true, name: true } } as const

export const commentRepository = {
  findByPost: (postId: string) =>
    prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: { author: authorSelect },
    }),

  findById: (id: string) =>
    prisma.comment.findUnique({
      where: { id },
      include: { author: authorSelect },
    }),

  create: (data: { content: string; postId: string; authorId: string }) =>
    prisma.comment.create({
      data,
      include: { author: authorSelect },
    }),

  remove: (id: string) =>
    prisma.comment.delete({ where: { id } }),
}
