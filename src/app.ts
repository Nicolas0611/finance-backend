// src/app.ts
import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import commentRoutes from "./routes/commentRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import { AppError } from "./utils/AppError";
import transactionRoutes from "./routes/transactionRoutes";

const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/posts/:postId/comments", commentRoutes); // nested: /api/posts/:postId/comments
app.use("/api/transactions", transactionRoutes);
// ─── 404 ─────────────────────────────────────────────────────────────────────
app.all("*", (req, _res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// ─── Global Error Handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

export default app;
