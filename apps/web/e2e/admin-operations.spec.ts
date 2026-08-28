import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { registerUser, resetAppState } from "./helpers";

async function createAndStartFair(page: Page) {
  await page.goto("/");
  await resetAppState(page);
  await registerUser(page, {
    displayName: "Local Operations Admin",
    email: "operations-admin@test.local",
    password: "operations-password123",
    role: "admin",
  });
  await page.goto("/admin/fairs");

  await page.getByRole("button", { name: "สร้าง Job Fair ใหม่" }).first().click();
  const studio = page.getByRole("dialog", { name: /สร้าง Job Fair ใหม่/i });
  await studio.locator("input[name='title']").fill("Operations Flow Fair");
  await studio.locator("input[name='slug']").fill("operations-flow-fair");
  await studio.locator("input[name='locationLabel']").fill("Local Browser");
  await studio.locator("input[name='startsAt']").fill("2026-08-28T00:00");
  await studio.locator("input[name='endsAt']").fill("2026-08-29T23:59");
  await studio.locator("textarea[name='summary']").fill("Synthetic fair for local operations verification");
  await studio.getByRole("button", { name: "สร้าง Job Fair ใหม่", exact: true }).click();
  await expect(studio).toBeHidden();

  await page.getByRole("button", { name: /^ทั้งหมด \(1\)$/ }).click();
  await page.getByRole("button", { name: "Publish งานแฟร์" }).click();
  let confirmation = page.getByRole("dialog", { name: /ยืนยัน: Publish งานแฟร์/i });
  await confirmation.getByRole("button", { name: "ยืนยันการเปลี่ยนสถานะ" }).click();
  await expect(confirmation).toBeHidden();

  await page.getByRole("button", { name: "เริ่มงาน" }).click();
  confirmation = page.getByRole("dialog", { name: /ยืนยัน: เริ่มงาน/i });
  await confirmation.getByRole("button", { name: "ยืนยันการเปลี่ยนสถานะ" }).click();
  await expect(confirmation).toBeHidden();
  await page.getByRole("link", { name: "Live Operations" }).click();
  await expect(page).toHaveURL(/\/ops\/events\/[^/]+\/live/);
}

test.describe("Admin Live Operations — local vertical flow", () => {
  test.describe.configure({ timeout: 90_000 });

  test.beforeEach(async ({ page }) => {
    await createAndStartFair(page);
  });

  test("pauses, resumes and records a local broadcast through visible controls", async ({ page }) => {
    await expect(page.getByText("LOCAL OPERATIONS SIMULATION").first()).toBeVisible();

    await page.getByLabel("เหตุผลที่ต้องพักงาน").fill("ตรวจสอบความพร้อมของระบบก่อนรับผู้เข้าร่วมเพิ่ม");
    await page.getByRole("button", { name: "ตรวจสอบก่อนพักงาน" }).click();
    const pauseDialog = page.getByRole("dialog", { name: "ยืนยันการพักงาน" });
    await pauseDialog.getByRole("button", { name: "ยืนยันพักงาน" }).click();
    await expect(page.getByText("งานกำลังพักอยู่")).toBeVisible();

    await page.getByLabel("เหตุผลที่พร้อมเปิดงานต่อ").fill("ตรวจสอบเสร็จแล้วและพร้อมเปิดรับผู้เข้าร่วมต่อ");
    await page.getByRole("button", { name: "ตรวจสอบก่อนเปิดงานต่อ" }).click();
    const resumeDialog = page.getByRole("dialog", { name: "ยืนยันการเปิดงานต่อ" });
    await resumeDialog.getByRole("button", { name: "ยืนยันเปิดงานต่อ" }).click();
    await expect(page.getByText("งานกำลังพักอยู่")).toBeHidden();

    await page.getByLabel("ข้อความประกาศ").fill("ระบบ Local Operations พร้อมให้บริการต่อแล้ว");
    await page.getByRole("button", { name: "บันทึกประกาศแบบ Local" }).click();
    await expect(page.getByText("ระบบ Local Operations พร้อมให้บริการต่อแล้ว")).toBeVisible();
    await expect(page.getByText(/ยังไม่มีการส่งผ่าน server/)).toBeVisible();
  });

  test("has no overflow and passes the operations accessibility smoke audit", async ({ page }) => {
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasOverflow).toBe(false);

    const results = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze();
    expect(results.violations).toEqual([]);
  });
});
