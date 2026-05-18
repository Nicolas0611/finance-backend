// src/routes/commentRoutes.ts
import { Router } from "express";
import { authenticate } from "@/middlewares/auth";
import { transactionController } from "@/controllers/transactionController";

// mergeParams: true gives access to :postId from the parent route
const router = Router({ mergeParams: true });

router.get("/", authenticate, transactionController.getAll);

export default router;
