// src/controllers/postController.ts
import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "@/utils/response";
import { transactionService } from "@/services/transactionService";

export const transactionController = {
  getAll: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const transactions = await transactionService.getAll(req.user!.id);
      sendSuccess(res, { transactions });
    } catch (err) {
      next(err);
    }
  },
};
