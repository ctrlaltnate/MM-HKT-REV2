import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { resetAppState, registerUser, openLoginModal } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await resetAppState(page);
});

/**
 * Checks that a page has no horizontal overflow.
 * Returns true if the document body scrollWidth <= viewport width.
 */
async function hasNoHorizontalOverflow(page: import("@playwright/test").Page): Promise<boolean> {
  return page.evaluate(() => {
    return document.documentElement.scrollWidth <= document.documentElement.clientWidth;
  });
}

test.describe("Landing page — responsive layout", () => {
  test("no horizontal overflow on landing page", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    const noOverflow = await hasNoHorizontalOverflow(page);
    expect(noOverflow).toBe(true);
  });

  test("landing page has visible main content", async ({ page }) => {
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("landing page passes axe accessibility audit", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .disableRules(["color-contrast"]) // pixel-art has intentional styling
      .analyze();

    expect(results.violations).toEqual([]);
  });
});

test.describe("Fairs page — responsive layout", () => {
  test("no horizontal overflow on /fairs", async ({ page }) => {
    await page.goto("/fairs");
    await page.waitForLoadState("networkidle");
    const noOverflow = await hasNoHorizontalOverflow(page);
    expect(noOverflow).toBe(true);
  });
});

test.describe("Dashboard — responsive layout", () => {
  test("no horizontal overflow on /app after login", async ({ page }) => {
    await registerUser(page, {
      displayName: "Responsive Test",
      email: "resp@test.local",
      password: "testpass1234",
      role: "candidate",
    });

    await page.goto("/app");
    await page.waitForLoadState("networkidle");
    const noOverflow = await hasNoHorizontalOverflow(page);
    expect(noOverflow).toBe(true);
  });
});

test.describe("Auth modal — responsive layout", () => {
  test("no horizontal overflow when auth modal is open", async ({ page }) => {
    await openLoginModal(page);

    const noOverflow = await hasNoHorizontalOverflow(page);
    expect(noOverflow).toBe(true);
  });
});

test.describe("404 page — responsive layout", () => {
  test("no horizontal overflow on 404 page", async ({ page }) => {
    await page.goto("/nonexistent-route-xyz");
    await page.waitForLoadState("networkidle");
    const noOverflow = await hasNoHorizontalOverflow(page);
    expect(noOverflow).toBe(true);
  });

  test("404 page has recovery link back to home", async ({ page }) => {
    await page.goto("/nonexistent-route-xyz");
    await page.waitForLoadState("domcontentloaded");

    // Should have a link or button to return home
    const homeLink = page.locator("a[href='/'], a[href='/fairs']").first();
    await expect(homeLink).toBeVisible();
  });

  test("404 page passes axe audit", async ({ page }) => {
    await page.goto("/nonexistent-route-xyz");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .disableRules(["color-contrast"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});

test.describe("Account settings — responsive layout", () => {
  test("no horizontal overflow on /account", async ({ page }) => {
    await registerUser(page, {
      displayName: "Account Resp",
      email: "acct-resp@test.local",
      password: "testpass1234",
      role: "candidate",
    });

    await page.goto("/account");
    await page.waitForLoadState("networkidle");
    const noOverflow = await hasNoHorizontalOverflow(page);
    expect(noOverflow).toBe(true);
  });
});

test.describe("Header — mobile menu", () => {
  test("mobile menu button has aria-expanded", async ({ page, isMobile }) => {
    // This test is most meaningful on mobile viewports
    if (!isMobile) {
      test.skip();
      return;
    }

    const menuButton = page.locator(".mobile-menu-button");
    await expect(menuButton).toBeVisible();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");

    // Nav should be open
    const nav = page.locator("nav.site-nav.is-open");
    await expect(nav).toBeVisible();
  });

  test("mobile nav has no horizontal overflow when open", async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
      return;
    }

    const menuButton = page.locator(".mobile-menu-button");
    await menuButton.click();

    const noOverflow = await hasNoHorizontalOverflow(page);
    expect(noOverflow).toBe(true);
  });
});