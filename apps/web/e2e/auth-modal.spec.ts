import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { resetAppState, registerUser, loginUser, openLoginModal } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await resetAppState(page);
});

test.describe("Auth Modal — open, close and focus management", () => {
  test("opens modal from header login button", async ({ page }) => {
    await openLoginModal(page);

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");

    // First focusable element inside modal should receive focus
    const firstInput = dialog.locator("input").first();
    await expect(firstInput).toBeFocused({ timeout: 3000 });
  });

  test("closes modal with Escape key", async ({ page }) => {
    await openLoginModal(page);

    await page.waitForSelector("[role='dialog']", { state: "visible" });
    await page.keyboard.press("Escape");

    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("closes modal when clicking backdrop", async ({ page }) => {
    await openLoginModal(page);

    const backdrop = page.locator(".modal-backdrop");
    await backdrop.click({ position: { x: 5, y: 5 } });

    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("closes modal with X button", async ({ page }) => {
    await openLoginModal(page);

    await page.waitForSelector("[role='dialog']", { state: "visible" });
    const closeButton = page.getByRole("button", { name: "ปิดหน้าต่างเข้าสู่ระบบ" });
    await closeButton.click();

    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("traps focus inside modal", async ({ page }) => {
    await openLoginModal(page);

    await page.waitForSelector("[role='dialog']", { state: "visible" });

    // Tab through all elements and verify focus stays in dialog
    const dialog = page.getByRole("dialog");
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press("Tab");
      const focused = page.locator(":focus");
      // The focused element should be within the dialog
      const isInDialog = await dialog.locator(":focus").count();
      expect(isInDialog).toBeGreaterThan(0);
    }
  });
});

test.describe("Auth Modal — registration flow", () => {
  test("registers a candidate user and navigates to dashboard", async ({ page }) => {
    await registerUser(page, {
      displayName: "ทดสอบ ผู้สมัคร",
      email: "candidate@test.local",
      password: "testpass1234",
      role: "candidate",
    });

    // Should navigate to /app after successful registration
    await expect(page).toHaveURL(/\/app/);
  });

  test("shows error for duplicate email", async ({ page }) => {
    await registerUser(page, {
      displayName: "First User",
      email: "dup@test.local",
      password: "testpass1234",
      role: "candidate",
    });

    // Logout by navigating to landing and clearing session
    await page.evaluate(() => {
      const db = JSON.parse(window.localStorage.getItem("maskedmatch.local.database.v1") || "{}");
      db.sessionUserId = null;
      window.localStorage.setItem("maskedmatch.local.database.v1", JSON.stringify(db));
    });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Try registering with same email
    await openLoginModal(page);

    const registerTab = page.getByRole("tab", { name: "สร้างบัญชี" });
    await registerTab.click();

    await page.locator("input[name='displayName']").fill("Duplicate");
    await page.locator("input[name='email']").fill("dup@test.local");
    await page.locator("input[name='password']").fill("testpass1234");
    await page.locator("[role='dialog'] button[type='submit']").click();

    // Should show error message
    const errorMessage = page.locator("[role='alert']");
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    await expect(errorMessage).toContainText("อีเมลนี้มีบัญชีอยู่แล้ว");
  });

  test("shows error for short password", async ({ page }) => {
    await openLoginModal(page);

    const registerTab = page.getByRole("tab", { name: "สร้างบัญชี" });
    await registerTab.click();

    await page.locator("input[name='displayName']").fill("Short Pass");
    await page.locator("input[name='email']").fill("short@test.local");
    await page.locator("input[name='password']").fill("1234567");
    await page.locator("[role='dialog'] button[type='submit']").click();

    const errorMessage = page.locator("[role='alert']");
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Auth Modal — login flow", () => {
  test("logs in successfully after registration", async ({ page }) => {
    // Register first
    await registerUser(page, {
      displayName: "Login Test",
      email: "login@test.local",
      password: "testpass1234",
      role: "candidate",
    });

    // Logout
    await page.evaluate(() => {
      const db = JSON.parse(window.localStorage.getItem("maskedmatch.local.database.v1") || "{}");
      db.sessionUserId = null;
      window.localStorage.setItem("maskedmatch.local.database.v1", JSON.stringify(db));
    });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Login
    await loginUser(page, "login@test.local", "testpass1234");

    await expect(page).toHaveURL(/\/app/);
  });

  test("shows error for wrong credentials", async ({ page }) => {
    await openLoginModal(page);

    await page.locator("input[name='email']").fill("nobody@test.local");
    await page.locator("input[name='password']").fill("wrongpassword");
    await page.locator("[role='dialog'] button[type='submit']").click();

    const errorMessage = page.locator("[role='alert']");
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    await expect(errorMessage).toContainText("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  });
});

test.describe("Auth Modal — accessibility", () => {
  test("auth modal passes axe accessibility audit", async ({ page }) => {
    await openLoginModal(page);

    const results = await new AxeBuilder({ page })
      .include("[role='dialog']")
      .disableRules(["color-contrast"]) // pixel-art styling may have intentional contrast
      .analyze();

    expect(results.violations).toEqual([]);
  });
});