// src/controllers/authController.ts
import { Request, Response, NextFunction } from "express";
import { authService } from "@/services/authService";
import { sendCreated, sendSuccess } from "@/utils/response";

export const authController = {
  register: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await authService.register(req.body);
      sendCreated(res, result);
    } catch (err) {
      next(err);
    }
  },

  login: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await authService.login(req.body);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  },

  getMe: (req: Request, res: Response): void => {
    sendSuccess(res, { user: req.user });
  },
};
