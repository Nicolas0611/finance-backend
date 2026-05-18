// src/repositories/commentRepository.ts
import prisma from "@/config/database";

const categorySelect = { select: { id: true, name: true } } as const;

export const transactionRepository = {
  findAll: (userId: string) =>
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      include: { category: categorySelect },
    }),

  findById: (id: string) =>
    prisma.transaction.findUnique({
      where: { id },
      include: { category: categorySelect },
    }),

  create: (data: {
    amount: number;
    description: string;
    categoryId: string;
    userId: string;
  }) =>
    prisma.transaction.create({
      data,
      include: { category: categorySelect },
    }),

  update: (
    id: string,
    data: { amount: number; description: string; categoryId: string },
  ) =>
    prisma.transaction.update({
      where: { id },
      data,
      include: { category: categorySelect },
    }),

  delete: (id: string) => prisma.transaction.delete({ where: { id } }),
};
