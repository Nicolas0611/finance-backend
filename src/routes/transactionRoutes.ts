import { Router } from "express";
import { authenticate } from "@/middlewares/auth";
import { validateQuery } from "@/middlewares/validate";
import { transactionController } from "@/controllers/transactionController";
import { paginationQuerySchema } from "@/validators/paginationValidators";

const router = Router({ mergeParams: true });

router.get(
  "/",
  authenticate,
  validateQuery(paginationQuerySchema),
  transactionController.getAll,
);

export default router;
