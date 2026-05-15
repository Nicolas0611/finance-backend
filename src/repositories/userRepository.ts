// src/repositories/userRepository.ts
// The only file that talks to the database for users.
// Return types are inferred automatically from Prisma — no manual typing needed.

import prisma from '@/config/database'

const safeFields = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
} as const

export const userRepository = {
  findAll: () =>
    prisma.user.findMany({ select: safeFields, orderBy: { createdAt: 'desc' } }),

  findById: (id: string) =>
    prisma.user.findUnique({ where: { id }, select: safeFields }),

  // Used during login — needs the password hash
  findByEmailWithPassword: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  create: (data: { name: string; email: string; password: string }) =>
    prisma.user.create({ data, select: safeFields }),

  update: (id: string, data: Partial<{ name: string; email: string }>) =>
    prisma.user.update({ where: { id }, data, select: safeFields }),

  remove: (id: string) =>
    prisma.user.delete({ where: { id } }),
}
