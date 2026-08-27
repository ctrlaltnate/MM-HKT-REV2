import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { resetAppState, registerUser, loginUser, openProfileDropdown } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await resetAppState(page);
});

test.describe("Fair Membership Governance — Recruiter Invitation Flow", () => {
  test("admin can invite recruiter by email and recruiter can accept invitation to open booth", async ({ page }) => {
    // 1. Register Admin and create a Fair
    await registerUser(page, {
      displayName: "Admin Organizer",
      email: "org-admin@test.local",
      password: "adminpassword123",
      role: "admin",
    });

    await page.goto("/admin/fairs");
    await expect(page).toHaveURL(/\/admin\/fairs/);

    // Create a new fair
    await page.locator("input[name='title']").fill("Bangkok Tech Fair 2026");
    await page.locator("input[name='slug']").fill("bkk-tech-2026");
    await page.locator("input[name='locationLabel']").fill("Online");
    await page.locator("input[name='startsAt']").fill("2026-10-01T09:00");
    await page.locator("input[name='endsAt']").fill("2026-10-01T18:00");
    await page.locator("textarea[name='summary']").fill("Annual tech hiring expo");
    await page.getByRole("button", { name: "สร้าง Draft" }).click();

    // Publish the fair so it becomes available
    const publishButton = page.getByRole("button", { name: "Publish" }).first();
    await expect(publishButton).toBeVisible();
    await publishButton.click();

    // 2. Admin invites recruiter by email
    const inviteTabBtn = page.getByRole("button", { name: /ส่งคำเชิญ/i }).first();
    await inviteTabBtn.click();

    const emailInput = page.getByLabel("อีเมล Recruiter ที่ต้องการเชิญ");
    await emailInput.fill("partner.recruiter@company.com");
    await page.locator("form").getByRole("button", { name: "ส่งคำเชิญ" }).click();

    await expect(page.getByText(/ส่งคำเชิญไปยัง partner.recruiter@company.com/)).toBeVisible();

    // 3. Logout Admin
    await openProfileDropdown(page);
    await Promise.all([
      page.waitForURL(/\/$/),
      page.locator(".profile-dropdown:visible").getByRole("menuitem", { name: "ออกจากระบบ" }).click(),
    ]);

    // 4. Register as the invited Recruiter
    await registerUser(page, {
      displayName: "Partner Recruiter",
      email: "partner.recruiter@company.com",
      password: "recruiterpassword123",
      role: "recruiter",
    });

    await page.goto("/recruiter/workspace");
    await expect(page).toHaveURL(/\/recruiter\/workspace/);

    // Verify invitation banner is visible
    await expect(page.getByText("คุณได้รับคำเชิญเข้าร่วม Job Fair!")).toBeVisible();
    await expect(page.getByText("Bangkok Tech Fair 2026").first()).toBeVisible();

    // Accept invitation
    await page.getByRole("button", { name: "ตอบรับคำเชิญ" }).first().click();

    // Fill Company profile
    await page.locator("input[name='name']").first().fill("Partner Tech Co.");
    await page.locator("input[name='industry']").fill("FinTech");
    await page.locator("input[name='workLocations']").fill("Bangkok");
    await page.locator("textarea[name='summary']").first().fill("Leading fintech innovators");
    await page.getByRole("button", { name: "บันทึกบริษัท" }).click();

    // Verify Fair is now selectable in Booth creation
    const fairSelect = page.locator("select[name='fairId']");
    await expect(fairSelect).toBeVisible();
    await fairSelect.selectOption({ label: "Bangkok Tech Fair 2026 · PUBLISHED" });

    await page.locator("input[name='name']").nth(1).fill("Partner FinTech Booth");
    await page.locator("textarea[name='summary']").nth(1).fill("Hiring Senior Engineers");
    await page.getByRole("button", { name: "Publish Booth" }).click();

    // Booth created successfully
    await expect(page.getByRole("heading", { name: "Partner FinTech Booth" })).toBeVisible();
  });
});

test.describe("Fair Membership Governance — Recruiter Access Request Flow", () => {
  test("recruiter can request fair access and admin approves it", async ({ page }) => {
    // 1. Register Admin and create a published Fair
    await registerUser(page, {
      displayName: "Fair Lead",
      email: "fair-lead@test.local",
      password: "adminpassword123",
      role: "admin",
    });

    await page.goto("/admin/fairs");
    await page.locator("input[name='title']").fill("AI Summit 2026");
    await page.locator("input[name='slug']").fill("ai-summit-2026");
    await page.locator("input[name='locationLabel']").fill("Bangkok");
    await page.locator("input[name='startsAt']").fill("2026-11-01T09:00");
    await page.locator("input[name='endsAt']").fill("2026-11-01T18:00");
    await page.locator("textarea[name='summary']").fill("AI innovation expo");
    await page.getByRole("button", { name: "สร้าง Draft" }).click();

    await page.getByRole("button", { name: "Publish" }).first().click();

    // Logout Admin
    await openProfileDropdown(page);
    await Promise.all([
      page.waitForURL(/\/$/),
      page.locator(".profile-dropdown:visible").getByRole("menuitem", { name: "ออกจากระบบ" }).click(),
    ]);

    // 2. Register Recruiter and request access
    await registerUser(page, {
      displayName: "AI Startup HR",
      email: "hr@aistartup.local",
      password: "recruiterpassword123",
      role: "recruiter",
    });

    await page.goto("/recruiter/workspace");
    await expect(page.getByText("AI Summit 2026")).toBeVisible();

    // Click request access
    const requestBtn = page.getByRole("button", { name: "ขอยื่นเข้าร่วมงาน" }).first();
    await requestBtn.click();

    // Status becomes pending
    await expect(page.getByText("รอผู้จัดงานอนุมัติ")).toBeVisible();

    // Logout Recruiter
    await openProfileDropdown(page);
    await Promise.all([
      page.waitForURL(/\/$/),
      page.locator(".profile-dropdown:visible").getByRole("menuitem", { name: "ออกจากระบบ" }).click(),
    ]);

    // 3. Admin logs in with existing credentials and approves the request
    await loginUser(page, "fair-lead@test.local", "adminpassword123");

    await page.goto("/admin/fairs");
    // Verify pending badge
    await expect(page.getByText(/1 คำขอรออนุมัติ/)).toBeVisible();

    // Go to pending tab and approve
    const pendingTab = page.getByRole("button", { name: /รออนุมัติ/i }).first();
    await pendingTab.click();

    const approveBtn = page.getByRole("button", { name: "อนุมัติเข้าร่วม" }).first();
    await approveBtn.click();

    // Verified approved
    await expect(page.getByText("ไม่มีคำขอรออนุมัติ")).toBeVisible();
  });
});

test.describe("Fair Membership Governance — Accessibility", () => {
  test("admin fairs page with governance panel passes axe audit", async ({ page }) => {
    await registerUser(page, {
      displayName: "Admin Axe",
      email: "axe-admin@test.local",
      password: "adminpassword123",
      role: "admin",
    });

    await page.goto("/admin/fairs");
    await expect(page.locator("h1")).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test("recruiter workspace with membership section passes axe audit", async ({ page }) => {
    await registerUser(page, {
      displayName: "Recruiter Axe",
      email: "axe-recruiter@test.local",
      password: "recruiterpassword123",
      role: "recruiter",
    });

    await page.goto("/recruiter/workspace");
    await expect(page.locator("h1")).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
