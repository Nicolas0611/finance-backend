import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "@/utils/response";
import { transactionService } from "@/services/transactionService";
import type { PaginationQuery } from "@/validators/paginationValidators";

export const transactionController = {
  getAll: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await transactionService.getAllPaginated(
        req.user!.id,
        req.validatedQuery as PaginationQuery,
      );
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  },
};
