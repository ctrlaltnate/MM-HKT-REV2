import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { resetAppState, registerUser, openProfileDropdown, ensureNavVisible } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await resetAppState(page);
  await registerUser(page, {
    displayName: "Profile User",
    email: "profile@test.local",
    password: "testpass1234",
    role: "candidate",
  });
});

test.describe("Profile dropdown — open and close", () => {
  test("opens profile dropdown on click", async ({ page }) => {
    await openProfileDropdown(page);

    const dropdown = page.locator(".profile-dropdown").filter({ visible: true }).first();
    await expect(dropdown).toBeVisible();
  });

  test("shows user name, email and role badge", async ({ page }) => {
    await openProfileDropdown(page);

    const dropdown = page.locator(".profile-dropdown").filter({ visible: true }).first();
    await expect(dropdown.getByText("Profile User")).toBeVisible();
    await expect(dropdown.getByText("profile@test.local")).toBeVisible();
    await expect(dropdown.getByText("Job Seeker")).toBeVisible();
  });

  test("closes dropdown with Escape key", async ({ page }) => {
    await openProfileDropdown(page);

    const dropdown = page.locator(".profile-dropdown").filter({ visible: true }).first();
    await expect(dropdown).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.locator(".profile-menu.is-open")).toHaveCount(0);
  });

  test("closes dropdown when clicking outside", async ({ page }) => {
    await openProfileDropdown(page);

    const dropdown = page.locator(".profile-dropdown").filter({ visible: true }).first();
    await expect(dropdown).toBeVisible();

    // Click outside profile dropdown (e.g. brand logo in header)
    await page.locator(".brand").click();

    await expect(page.locator(".profile-menu.is-open")).toHaveCount(0);
  });

  test("profile trigger has aria-expanded and aria-haspopup", async ({ page }) => {
    await ensureNavVisible(page);
    const trigger = page.locator(".profile-trigger").filter({ visible: true }).first();
    await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});

test.describe("Profile dropdown — navigation", () => {
  test("navigates to account settings", async ({ page }) => {
    await openProfileDropdown(page);

    const dropdown = page.locator(".profile-dropdown").filter({ visible: true }).first();
    const accountLink = dropdown.getByRole("menuitem", { name: /ตั้งค่าบัญชีผู้ใช้/ });
    await accountLink.click();

    await expect(page).toHaveURL(/\/account/);
  });

  test("logout returns to landing page", async ({ page }) => {
    await openProfileDropdown(page);

    const dropdown = page.locator(".profile-dropdown").filter({ visible: true }).first();
    const logoutButton = dropdown.getByText("ออกจากระบบ");
    await Promise.all([
      page.waitForURL((url) => url.pathname === "/" || url.pathname === ""),
      logoutButton.click(),
    ]);

    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("Profile dropdown — accessibility", () => {
  test("dropdown menu passes axe audit", async ({ page }) => {
    await openProfileDropdown(page);

    const dropdown = page.locator(".profile-dropdown").filter({ visible: true }).first();
    await expect(dropdown).toBeVisible();

    const results = await new AxeBuilder({ page })
      .include(".profile-menu.is-open")
      .disableRules(["color-contrast"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("dropdown has role=menu and menuitems", async ({ page }) => {
    await openProfileDropdown(page);

    const dropdown = page.locator(".profile-dropdown[role='menu']").filter({ visible: true }).first();
    await expect(dropdown).toBeVisible();

    const menuItems = dropdown.locator("[role='menuitem']");
    expect(await menuItems.count()).toBeGreaterThanOrEqual(2);
  });
});
