import prisma from "@/config/database";
import { paginate, type PaginationParams } from "@/utils/pagination";

const categorySelect = { select: { id: true, name: true } } as const;

export const transactionRepository = {
  findManyPaginated: (userId: string, pagination: PaginationParams) => {
    const where = { userId };

    return paginate({
      pagination,
      findMany: () =>
        prisma.transaction.findMany({
          where,
          skip: pagination.skip,
          take: pagination.take,
          orderBy: { createdAt: "desc" },
          include: { category: categorySelect },
        }),
      count: () => prisma.transaction.count({ where }),
    });
  },

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
