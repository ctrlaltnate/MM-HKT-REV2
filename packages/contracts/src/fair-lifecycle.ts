import type { FairStatus, JobFair } from "./domain.js";

export type FairLifecycleAction =
  | "PUBLISH"
  | "START"
  | "PAUSE"
  | "RESUME"
  | "END"
  | "CANCEL"
  | "ARCHIVE"
  | "RESTORE_DRAFT";

const lifecycleTransitions: Record<FairLifecycleAction, Partial<Record<FairStatus, FairStatus>>> = {
  PUBLISH: { DRAFT: "PUBLISHED" },
  START: { PUBLISHED: "LIVE" },
  PAUSE: { LIVE: "PAUSED" },
  RESUME: { PAUSED: "LIVE" },
  END: { LIVE: "ENDED", PAUSED: "ENDED" },
  CANCEL: { PUBLISHED: "CANCELLED" },
  ARCHIVE: { ENDED: "ARCHIVED", CANCELLED: "ARCHIVED" },
  // Local preparation convenience only; connected mode should create a new draft version.
  RESTORE_DRAFT: { ARCHIVED: "DRAFT" },
};

export class FairLifecycleError extends Error {
  constructor(
    public readonly code:
      | "INVALID_TRANSITION"
      | "INVALID_SCHEDULE"
      | "EVENT_ALREADY_ENDED"
      | "EVENT_NOT_STARTED",
    message: string,
  ) {
    super(message);
    this.name = "FairLifecycleError";
  }
}

export function resolveFairTransition(
  fair: Pick<JobFair, "status" | "startsAt" | "endsAt">,
  action: FairLifecycleAction,
  now = new Date(),
): FairStatus {
  const nextStatus = lifecycleTransitions[action][fair.status];
  if (!nextStatus) {
    throw new FairLifecycleError(
      "INVALID_TRANSITION",
      `ไม่สามารถใช้คำสั่ง ${action} เมื่อสถานะงานเป็น ${fair.status}`,
    );
  }

  const startsAt = new Date(fair.startsAt);
  const endsAt = new Date(fair.endsAt);
  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || endsAt <= startsAt) {
    throw new FairLifecycleError("INVALID_SCHEDULE", "กำหนดการเริ่มและสิ้นสุดงานไม่ถูกต้อง");
  }

  if (action === "PUBLISH" && endsAt <= now) {
    throw new FairLifecycleError("EVENT_ALREADY_ENDED", "ไม่สามารถ Publish งานที่เลยเวลาสิ้นสุดแล้ว");
  }

  if (action === "START" && now < startsAt) {
    throw new FairLifecycleError(
      "EVENT_NOT_STARTED",
      "ยังไม่ถึงเวลาเริ่มงาน กรุณาปรับกำหนดการหรือรอจนถึงเวลาเริ่ม",
    );
  }

  if (action === "START" && now >= endsAt) {
    throw new FairLifecycleError("EVENT_ALREADY_ENDED", "ไม่สามารถเริ่มงานที่เลยเวลาสิ้นสุดแล้ว");
  }

  return nextStatus;
}

export function getPrimaryFairAction(status: FairStatus): FairLifecycleAction | null {
  switch (status) {
    case "DRAFT":
      return "PUBLISH";
    case "PUBLISHED":
      return "START";
    case "LIVE":
    case "PAUSED":
      return "END";
    case "ENDED":
    case "CANCELLED":
      return "ARCHIVE";
    case "ARCHIVED":
      return "RESTORE_DRAFT";
  }
}
