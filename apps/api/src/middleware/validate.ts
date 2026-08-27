import type { Request, Response, NextFunction } from "express";
import { type ZodSchema } from "zod";
import type { ApiErrorEnvelope } from "@maskedmatch/contracts";

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issue = result.error.issues[0];
      const message = issue ? issue.message : "ข้อมูลที่ส่งมาไม่ถูกต้อง";
      const errorBody: ApiErrorEnvelope = {
        error: {
          code: "VALIDATION_ERROR",
          message,
          retryable: false,
        },
      };
      res.status(400).json(errorBody);
      return;
    }
    req.body = result.data;
    next();
  };
}
