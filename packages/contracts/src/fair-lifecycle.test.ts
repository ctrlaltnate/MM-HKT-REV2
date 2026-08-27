import { describe, expect, it } from "vitest";

import { FairLifecycleError, resolveFairTransition } from "./fair-lifecycle.js";

const schedule = {
  startsAt: "2026-08-27T09:00:00.000Z",
  endsAt: "2026-08-27T17:00:00.000Z",
};

describe("fair lifecycle", () => {
  it("supports the canonical live pause resume and end transitions", () => {
    const now = new Date("2026-08-27T12:00:00.000Z");
    expect(resolveFairTransition({ ...schedule, status: "LIVE" }, "PAUSE", now)).toBe("PAUSED");
    expect(resolveFairTransition({ ...schedule, status: "PAUSED" }, "RESUME", now)).toBe("LIVE");
    expect(resolveFairTransition({ ...schedule, status: "PAUSED" }, "END", now)).toBe("ENDED");
  });

  it("blocks starting before the scheduled opening time", () => {
    expect(() =>
      resolveFairTransition(
        { ...schedule, status: "PUBLISHED" },
        "START",
        new Date("2026-08-27T08:00:00.000Z"),
      ),
    ).toThrowError(FairLifecycleError);
  });

  it("blocks illegal transitions", () => {
    expect(() =>
      resolveFairTransition(
        { ...schedule, status: "DRAFT" },
        "END",
        new Date("2026-08-27T12:00:00.000Z"),
      ),
    ).toThrow("ไม่สามารถใช้คำสั่ง END");
  });
});
