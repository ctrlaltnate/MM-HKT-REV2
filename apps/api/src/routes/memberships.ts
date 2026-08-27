import { Router } from "express";
import {
  InviteRecruiterSchema,
  ReviewFairMembershipSchema,
  type ApiErrorEnvelope,
} from "@maskedmatch/contracts";
import { validateBody } from "../middleware/validate.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { dataStore } from "../store/data-store.js";

export const membershipsRouter = Router();

// GET /api/fairs/:fairId/memberships
membershipsRouter.get("/:fairId/memberships", requireAuth, (req, res) => {
  const fairId = String(req.params.fairId);
  const memberships = dataStore.getMembershipsByFair(fairId);
  res.json({ memberships });
});

// POST /api/fairs/:fairId/memberships/join (Candidate only)
membershipsRouter.post("/:fairId/memberships/join", requireRole(["candidate"]), (req, res) => {
  try {
    const fairId = String(req.params.fairId);
    const membership = dataStore.joinFairAsCandidate(fairId, req.user!.id);
    res.status(201).json({ membership });
  } catch (err) {
    const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเข้าร่วมงาน";
    const errorBody: ApiErrorEnvelope = {
      error: {
        code: "JOIN_FAILED",
        message,
        retryable: false,
      },
    };
    res.status(400).json(errorBody);
  }
});

// POST /api/fairs/:fairId/memberships/request (Recruiter only)
membershipsRouter.post("/:fairId/memberships/request", requireRole(["recruiter"]), (req, res) => {
  try {
    const fairId = String(req.params.fairId);
    const membership = dataStore.requestRecruiterFairAccess(fairId, req.user!.id);
    res.status(201).json({ membership });
  } catch (err) {
    const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการยื่นขอสิทธิ์";
    const errorBody: ApiErrorEnvelope = {
      error: {
        code: "REQUEST_FAILED",
        message,
        retryable: false,
      },
    };
    res.status(400).json(errorBody);
  }
});

// POST /api/fairs/:fairId/memberships/invite (Admin only)
membershipsRouter.post(
  "/:fairId/memberships/invite",
  requireRole(["admin"]),
  validateBody(InviteRecruiterSchema),
  (req, res) => {
    try {
      const fairId = String(req.params.fairId);
      const membership = dataStore.inviteRecruiterToFair(fairId, req.body.email);
      res.status(201).json({ membership });
    } catch (err) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการส่งคำเชิญ";
      const errorBody: ApiErrorEnvelope = {
        error: {
          code: "INVITE_FAILED",
          message,
          retryable: false,
        },
      };
      res.status(400).json(errorBody);
    }
  },
);

// PATCH /api/fairs/:fairId/memberships/:membershipId/review (Admin only)
membershipsRouter.patch(
  "/:fairId/memberships/:membershipId/review",
  requireRole(["admin"]),
  validateBody(ReviewFairMembershipSchema),
  (req, res) => {
    try {
      const membershipId = String(req.params.membershipId);
      const membership = dataStore.reviewFairMembership(membershipId, req.body.decision, req.user!.id);
      res.json({ membership });
    } catch (err) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์";
      const errorBody: ApiErrorEnvelope = {
        error: {
          code: "REVIEW_FAILED",
          message,
          retryable: false,
        },
      };
      res.status(400).json(errorBody);
    }
  },
);

// POST /api/fairs/:fairId/memberships/accept (Recruiter accepting invite)
membershipsRouter.post("/:fairId/memberships/accept", requireRole(["recruiter"]), (req, res) => {
  try {
    const { membershipId } = req.body;
    if (!membershipId) {
      res.status(400).json({
        error: { code: "VALIDATION_ERROR", message: "กรุณาระบุ membershipId", retryable: false },
      });
      return;
    }
    const membership = dataStore.acceptFairInvitation(String(membershipId), req.user!.id);
    res.json({ membership });
  } catch (err) {
    const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการตอบรับคำเชิญ";
    const errorBody: ApiErrorEnvelope = {
      error: {
        code: "ACCEPT_FAILED",
        message,
        retryable: false,
      },
    };
    res.status(400).json(errorBody);
  }
});

// DELETE /api/fairs/:fairId/memberships/:membershipId (Admin only)
membershipsRouter.delete(
  "/:fairId/memberships/:membershipId",
  requireRole(["admin"]),
  (req, res) => {
    try {
      const membershipId = String(req.params.membershipId);
      dataStore.removeFairMembership(membershipId);
      res.json({ success: true, message: "ยกเลิกสิทธิ์สมาชิกเรียบร้อยแล้ว" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการยกเลิกสิทธิ์";
      const errorBody: ApiErrorEnvelope = {
        error: {
          code: "REMOVE_FAILED",
          message,
          retryable: false,
        },
      };
      res.status(400).json(errorBody);
    }
  },
);
