// src/repositories/postRepository.ts
import { Prisma } from '@prisma/client'
import prisma from '@/config/database'

const authorSelect = { select: { id: true, name: true } } as const

export const postRepository = {
  findAll: (where: Prisma.PostWhereInput = {}) =>
    prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { author: authorSelect },
    }),

  findById: (id: string) =>
    prisma.post.findUnique({
      where: { id },
      include: { author: authorSelect },
    }),

  create: (data: Prisma.PostUncheckedCreateInput) =>
    prisma.post.create({
      data,
      include: { author: authorSelect },
    }),

  update: (id: string, data: Prisma.PostUpdateInput) =>
    prisma.post.update({
      where: { id },
      data,
      include: { author: authorSelect },
    }),

  remove: (id: string) =>
    prisma.post.delete({ where: { id } }),
}
