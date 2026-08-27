import { Router } from "express";
import {
  RegisterUserRequestSchema,
  LoginUserRequestSchema,
  AccountUpdateRequestSchema,
  PasswordChangeRequestSchema,
  type ApiErrorEnvelope,
} from "@maskedmatch/contracts";
import { validateBody } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { dataStore } from "../store/data-store.js";

export const authRouter = Router();

authRouter.post("/register", validateBody(RegisterUserRequestSchema), (req, res) => {
  try {
    const user = dataStore.createUser(req.body);
    res.status(201).json({ user, token: user.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการลงทะเบียน";
    const errorBody: ApiErrorEnvelope = {
      error: {
        code: "USER_ALREADY_EXISTS",
        message,
        retryable: false,
      },
    };
    res.status(409).json(errorBody);
  }
});

authRouter.post("/login", validateBody(LoginUserRequestSchema), (req, res) => {
  const user = dataStore.authenticate(req.body.email, req.body.password);
  if (!user) {
    const errorBody: ApiErrorEnvelope = {
      error: {
        code: "INVALID_CREDENTIALS",
        message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        retryable: false,
      },
    };
    res.status(401).json(errorBody);
    return;
  }
  res.json({ user, token: user.id });
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

authRouter.patch("/account", requireAuth, validateBody(AccountUpdateRequestSchema), (req, res) => {
  try {
    const updated = dataStore.updateUserAccount(req.user!.id, req.body);
    res.json({ user: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "ไม่สามารถแก้ไขข้อมูลบัญชีได้";
    const errorBody: ApiErrorEnvelope = {
      error: {
        code: "UPDATE_FAILED",
        message,
        retryable: false,
      },
    };
    res.status(400).json(errorBody);
  }
});

authRouter.post("/password", requireAuth, validateBody(PasswordChangeRequestSchema), (req, res) => {
  try {
    dataStore.changePassword(req.user!.id, req.body.currentPassword, req.body.newPassword);
    res.json({ success: true, message: "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "ไม่สามารถเปลี่ยนรหัสผ่านได้";
    const errorBody: ApiErrorEnvelope = {
      error: {
        code: "INVALID_PASSWORD",
        message,
        retryable: false,
      },
    };
    res.status(400).json(errorBody);
  }
});
