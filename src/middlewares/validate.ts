// src/middlewares/validate.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

const formatValidationErrors = (error: {
  errors: { path: (string | number)[]; message: string }[];
}) =>
  error.errors.map((e) => ({
    field: e.path.join("."),
    message: e.message,
  }));

// Generic: works with any Zod schema (request body)
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formatValidationErrors(result.error),
      });
      return;
    }

    req.body = result.data;
    next();
  };
};

// Generic: works with any Zod schema (query string)
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formatValidationErrors(result.error),
      });
      return;
    }

    req.validatedQuery = result.data;
    next();
  };
};
