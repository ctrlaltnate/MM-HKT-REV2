import type { Request, Response, NextFunction } from "express";
import type { AppUser, UserRole, ApiErrorEnvelope } from "@maskedmatch/contracts";
import { dataStore } from "../store/data-store.js";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: AppUser;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const headerUserId = req.headers["x-user-id"] as string | undefined;

  let userId: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    userId = authHeader.substring(7).trim();
  } else if (headerUserId) {
    userId = headerUserId.trim();
  }

  if (userId) {
    const localUser = dataStore.findUserById(userId);
    if (localUser) {
      req.user = dataStore.toAppUser(localUser);
    }
  }

  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    const errorBody: ApiErrorEnvelope = {
      error: {
        code: "UNAUTHORIZED",
        message: "กรุณาเข้าสู่ระบบก่อนทำรายการ",
        retryable: false,
      },
    };
    res.status(401).json(errorBody);
    return;
  }
  next();
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const errorBody: ApiErrorEnvelope = {
        error: {
          code: "UNAUTHORIZED",
          message: "กรุณาเข้าสู่ระบบก่อนทำรายการ",
          retryable: false,
        },
      };
      res.status(401).json(errorBody);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      const errorBody: ApiErrorEnvelope = {
        error: {
          code: "FORBIDDEN",
          message: "คุณไม่มีสิทธิ์เข้าถึงหรือทำรายการในส่วนนี้",
          retryable: false,
        },
      };
      res.status(403).json(errorBody);
      return;
    }

    next();
  };
}
