import { Router } from "express";
import {
  CreateFairRequestSchema,
  UpdateFairRequestSchema,
  type ApiErrorEnvelope,
} from "@maskedmatch/contracts";
import { validateBody } from "../middleware/validate.js";
import { requireRole } from "../middleware/auth.js";
import { dataStore } from "../store/data-store.js";

export const fairsRouter = Router();

// GET /api/fairs (Public or Admin view)
fairsRouter.get("/", (req, res) => {
  const fairs = dataStore.getFairs(req.user?.role);
  res.json({ fairs });
});

// GET /api/fairs/:idOrSlug
fairsRouter.get("/:idOrSlug", (req, res) => {
  const idOrSlug = String(req.params.idOrSlug);
  const fair = dataStore.getFairById(idOrSlug) || dataStore.getFairBySlug(idOrSlug);
  if (!fair) {
    const errorBody: ApiErrorEnvelope = {
      error: {
        code: "FAIR_NOT_FOUND",
        message: "ไม่พบข้อมูลงานแฟร์",
        retryable: false,
      },
    };
    res.status(404).json(errorBody);
    return;
  }
  res.json({ fair });
});

// POST /api/fairs (Admin only)
fairsRouter.post("/", requireRole(["admin"]), validateBody(CreateFairRequestSchema), (req, res) => {
  try {
    const fair = dataStore.createFair(req.user!.id, req.body);
    res.status(201).json({ fair });
  } catch (err) {
    const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการสร้างงานแฟร์";
    const errorBody: ApiErrorEnvelope = {
      error: {
        code: "CREATE_FAIR_FAILED",
        message,
        retryable: false,
      },
    };
    res.status(400).json(errorBody);
  }
});

// PATCH /api/fairs/:id (Admin only)
fairsRouter.patch("/:id", requireRole(["admin"]), validateBody(UpdateFairRequestSchema), (req, res) => {
  try {
    const id = String(req.params.id);
    const fair = dataStore.updateFair(id, req.body);
    res.json({ fair });
  } catch (err) {
    const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการแก้ไขงานแฟร์";
    const errorBody: ApiErrorEnvelope = {
      error: {
        code: "UPDATE_FAIR_FAILED",
        message,
        retryable: false,
      },
    };
    res.status(400).json(errorBody);
  }
});

// DELETE /api/fairs/:id (Admin only)
fairsRouter.delete("/:id", requireRole(["admin"]), (req, res) => {
  try {
    const id = String(req.params.id);
    dataStore.deleteFair(id);
    res.json({ success: true, message: "ลบงานแฟร์เรียบร้อยแล้ว" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการลบงานแฟร์";
    const errorBody: ApiErrorEnvelope = {
      error: {
        code: "DELETE_FAIR_FAILED",
        message,
        retryable: false,
      },
    };
    res.status(400).json(errorBody);
  }
});
