// src/services/commentService.ts

import { transactionRepository } from "@/repositories/transactionRepository";

export const transactionService = {
  getAll: (userId: string) => transactionRepository.findAll(userId),
};
