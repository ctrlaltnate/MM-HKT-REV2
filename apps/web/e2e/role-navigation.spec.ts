import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { resetAppState, registerUser, ensureNavVisible } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await resetAppState(page);
});

test.describe("Role-based navigation — candidate", () => {
  test("candidate sees แดชบอร์ด and จ็อบแฟร์ nav links", async ({ page }) => {
    await registerUser(page, {
      displayName: "Candidate Nav",
      email: "nav-cand@test.local",
      password: "testpass1234",
      role: "candidate",
    });

    await ensureNavVisible(page);
    const nav = page.locator("nav[aria-label='เมนูหลัก']");
    await expect(nav.getByRole("link", { name: "แดชบอร์ด", exact: true })).toBeVisible();
    await expect(nav.getByRole("link", { name: "จ็อบแฟร์", exact: true })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Recruiter Studio", exact: true })).toBeHidden();
    await expect(nav.getByRole("link", { name: "จัดการงานแฟร์", exact: true })).toBeHidden();
  });

  test("candidate can navigate to /fairs", async ({ page }) => {
    await registerUser(page, {
      displayName: "Candidate Fairs",
      email: "fairs-cand@test.local",
      password: "testpass1234",
      role: "candidate",
    });

    await ensureNavVisible(page);
    await page.locator("nav[aria-label='เมนูหลัก']").getByText("จ็อบแฟร์").first().click();
    await expect(page).toHaveURL(/\/fairs/);
  });

  test("candidate is redirected when visiting /admin/fairs", async ({ page }) => {
    await registerUser(page, {
      displayName: "Candidate Block",
      email: "block-cand@test.local",
      password: "testpass1234",
      role: "candidate",
    });

    await page.goto("/admin/fairs");
    // Should be redirected to /app (role mismatch)
    await expect(page).toHaveURL(/\/app/);
  });

  test("candidate is redirected when visiting /recruiter/workspace", async ({ page }) => {
    await registerUser(page, {
      displayName: "Candidate Block2",
      email: "block2-cand@test.local",
      password: "testpass1234",
      role: "candidate",
    });

    await page.goto("/recruiter/workspace");
    await expect(page).toHaveURL(/\/app/);
  });
});

test.describe("Role-based navigation — recruiter", () => {
  test("recruiter sees แดชบอร์ด link", async ({ page }) => {
    await registerUser(page, {
      displayName: "Recruiter Nav",
      email: "nav-rec@test.local",
      password: "testpass1234",
      role: "recruiter",
    });

    await ensureNavVisible(page);
    const nav = page.locator("nav[aria-label='เมนูหลัก']");
    await expect(nav.getByRole("link", { name: "แดชบอร์ด", exact: true })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Recruiter Studio", exact: true })).toBeVisible();
  });

  test("recruiter can navigate to workspace", async ({ page }) => {
    await registerUser(page, {
      displayName: "Recruiter WS",
      email: "ws-rec@test.local",
      password: "testpass1234",
      role: "recruiter",
    });

    await ensureNavVisible(page);
    await page.locator("nav[aria-label='เมนูหลัก']").getByRole("link", { name: "Recruiter Studio", exact: true }).click();
    await expect(page).toHaveURL(/\/recruiter\/workspace/);
  });

  test("recruiter is redirected from admin fairs", async ({ page }) => {
    await registerUser(page, {
      displayName: "Recruiter Block",
      email: "block-rec@test.local",
      password: "testpass1234",
      role: "recruiter",
    });

    await page.goto("/admin/fairs");
    await expect(page).toHaveURL(/\/app/);
  });
});

test.describe("Role-based navigation — admin", () => {
  test("admin sees แดชบอร์ด link", async ({ page }) => {
    await registerUser(page, {
      displayName: "Admin Nav",
      email: "nav-admin@test.local",
      password: "testpass1234",
      role: "admin",
    });

    await ensureNavVisible(page);
    const nav = page.locator("nav[aria-label='เมนูหลัก']");
    await expect(nav.getByRole("link", { name: "แดชบอร์ด", exact: true })).toBeVisible();
    await expect(nav.getByRole("link", { name: "จัดการงานแฟร์", exact: true })).toBeVisible();
  });

  test("admin can navigate to /admin/fairs", async ({ page }) => {
    await registerUser(page, {
      displayName: "Admin Fairs",
      email: "fairs-admin@test.local",
      password: "testpass1234",
      role: "admin",
    });

    await ensureNavVisible(page);
    await page.locator("nav[aria-label='เมนูหลัก']").getByRole("link", { name: "จัดการงานแฟร์", exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/fairs/);
  });
});

test.describe("Unauthenticated navigation", () => {
  test("unauthenticated user sees public nav links", async ({ page }) => {
    await ensureNavVisible(page);
    const nav = page.locator("nav[aria-label='เมนูหลัก']");
    await expect(nav.getByText("หน้าแรก")).toBeVisible();
    await expect(nav.getByText("จ็อบแฟร์")).toBeVisible();
  });

  test("unauthenticated user is redirected from protected routes", async ({ page }) => {
    await page.goto("/app");
    await expect(page).toHaveURL(/\/auth/);
  });

  test("unauthenticated user can browse fairs", async ({ page }) => {
    await page.goto("/fairs");
    await expect(page).toHaveURL(/\/fairs/);
    // Page should render without error
    await expect(page.locator("main")).toBeVisible();
  });
});

test.describe("Navigation — accessibility", () => {
  test("main navigation passes axe audit", async ({ page }) => {
    await page.waitForSelector("header", { state: "visible" });
    const results = await new AxeBuilder({ page })
      .include("header")
      .disableRules(["color-contrast"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("navigation has proper aria-label", async ({ page }) => {
    const nav = page.locator("nav[aria-label='เมนูหลัก']");
    await expect(nav).toHaveAttribute("aria-label", "เมนูหลัก");
  });
});
