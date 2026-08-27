import { type Page } from "@playwright/test";

/**
 * Clear localStorage to start each test from a clean state.
 */
export async function resetAppState(page: Page): Promise<void> {
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await page.waitForLoadState("domcontentloaded");
}

/**
 * Open the authentication modal across any viewport (desktop, tablet, mobile).
 */
export async function openLoginModal(page: Page): Promise<void> {
  const viewport = page.viewportSize();
  const isMobile = viewport ? viewport.width < 640 : false;

  if (isMobile) {
    const mobileMenuButton = page.locator(".mobile-menu-button");
    const isNavOpen = await page.locator("nav.site-nav.is-open").isVisible();
    if (!isNavOpen) {
      await mobileMenuButton.click({ force: true });
      await page.waitForSelector("nav.site-nav.is-open", { state: "visible" });
    }
    await page.locator(".mobile-nav-account").click();
  } else {
    await page.locator(".header-login").click();
  }
  await page.waitForSelector("[role='dialog']", { state: "visible" });
}

/**
 * Ensure navigation links are accessible on any viewport.
 */
export async function ensureNavVisible(page: Page): Promise<void> {
  const viewport = page.viewportSize();
  if (viewport && viewport.width < 640) {
    const isNavOpen = await page.locator("nav.site-nav.is-open").isVisible();
    if (!isNavOpen) {
      await page.locator(".mobile-menu-button").click({ force: true });
      await page.waitForSelector("nav.site-nav.is-open", { state: "visible" });
    }
  }
}

/**
 * Open profile trigger on any viewport.
 */
export async function openProfileDropdown(page: Page): Promise<void> {
  const viewport = page.viewportSize();
  if (viewport && viewport.width < 640) {
    await ensureNavVisible(page);
    await page.locator(".profile-menu-mobile .profile-trigger").click();
    await page.waitForSelector(".profile-menu-mobile .profile-dropdown", { state: "visible" });
  } else {
    await page.locator(".header-account .profile-trigger").click();
    await page.waitForSelector(".header-account .profile-dropdown", { state: "visible" });
  }
}

/**
 * Register a new user via the auth modal UI.
 * Uses exact field names from AuthForm.tsx: displayName, email, password, role.
 */
export async function registerUser(
  page: Page,
  options: {
    displayName: string;
    email: string;
    password: string;
    role: "candidate" | "recruiter" | "admin";
  },
): Promise<void> {
  await openLoginModal(page);

  // Switch to register tab
  const registerTab = page.getByRole("tab", { name: "สร้างบัญชี" });
  await registerTab.click();
  await page.waitForSelector("select[name='role']", { state: "visible" });

  // Fill form fields by name attribute
  await page.locator("input[name='displayName']").fill(options.displayName);
  await page.locator("select[name='role']").selectOption(options.role);
  await page.locator("input[name='email']").fill(options.email);
  await page.locator("input[name='password']").fill(options.password);

  // Submit
  await page.locator("[role='dialog'] button[type='submit']").click();

  // Wait for modal to close (auth complete navigates to /app)
  await page.waitForSelector("[role='dialog']", { state: "hidden", timeout: 10_000 });
}

/**
 * Login an existing user via the auth modal UI.
 */
export async function loginUser(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  await openLoginModal(page);

  // Ensure we are on login tab
  const loginTab = page.getByRole("tab", { name: "เข้าสู่ระบบ" });
  await loginTab.click();

  await page.locator("input[name='email']").fill(email);
  await page.locator("input[name='password']").fill(password);

  await page.locator("[role='dialog'] button[type='submit']").click();

  await page.waitForSelector("[role='dialog']", { state: "hidden", timeout: 10_000 });
}