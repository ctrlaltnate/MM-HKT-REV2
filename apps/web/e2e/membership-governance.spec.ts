import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { resetAppState, registerUser, loginUser, openProfileDropdown } from "./helpers";

async function createFair(page: import("@playwright/test").Page, fair: {
  title: string;
  slug: string;
  location: string;
  startsAt: string;
  endsAt: string;
  summary: string;
}) {
  await page.getByRole("button", { name: "สร้าง Job Fair ใหม่" }).first().click();
  const dialog = page.getByRole("dialog", { name: /สร้าง Job Fair ใหม่/i });
  await expect(dialog).toBeVisible();
  await dialog.locator("input[name='title']").fill(fair.title);
  await dialog.locator("input[name='slug']").fill(fair.slug);
  await dialog.locator("input[name='locationLabel']").fill(fair.location);
  await dialog.locator("input[name='startsAt']").fill(fair.startsAt);
  await dialog.locator("input[name='endsAt']").fill(fair.endsAt);
  await dialog.locator("textarea[name='summary']").fill(fair.summary);
  await dialog.getByRole("button", { name: "สร้าง Job Fair ใหม่", exact: true }).click();
  await expect(dialog).toBeHidden();
  await page.getByRole("button", { name: /^ทั้งหมด \(1\)$/ }).click();
}

async function publishFirstFair(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: "Publish งานแฟร์" }).first().click();
  const dialog = page.getByRole("dialog", { name: /ยืนยัน: Publish งานแฟร์/i });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "ยืนยันการเปลี่ยนสถานะ" }).click();
  await expect(dialog).toBeHidden();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await resetAppState(page);
});

test.describe("Fair Membership Governance — Recruiter Invitation Flow", () => {
  test.describe.configure({ timeout: 90_000 });
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

    await createFair(page, {
      title: "Bangkok Tech Fair 2026",
      slug: "bkk-tech-2026",
      location: "Online",
      startsAt: "2026-10-01T09:00",
      endsAt: "2026-10-01T18:00",
      summary: "Annual tech hiring expo",
    });
    await publishFirstFair(page);

    // 2. Admin invites recruiter by email
    await page.getByRole("button", { name: /^สมาชิกและคำขอ/ }).first().click();
    const inviteTabBtn = page.getByRole("button", { name: /ส่งคำเชิญ/i }).first();
    await inviteTabBtn.click();

    const emailInput = page.getByLabel("อีเมล Recruiter ที่ต้องการเชิญ");
    await emailInput.fill("partner.recruiter@company.com");
    await page.locator("form").getByRole("button", { name: "ส่งคำเชิญ" }).click();

    await expect(page.getByText(/ส่งคำเชิญไปยัง partner.recruiter@company.com/)).toBeVisible();
    await page.getByRole("dialog").getByRole("button", { name: "ปิดหน้าต่าง", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

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
    await page.getByRole("button", { name: "เพิ่มข้อมูลบริษัท" }).click();
    await page.locator("input[name='name']").first().fill("Partner Tech Co.");
    await page.locator("input[name='industry']").fill("FinTech");
    await page.locator("input[name='workLocations']").fill("Bangkok");
    await page.locator("textarea[name='summary']").first().fill("Leading fintech innovators");
    await page.getByRole("button", { name: "บันทึกบริษัท" }).click();

    // Verify Fair is now selectable in Booth creation
    await page.getByRole("button", { name: "สร้างบูธ", exact: true }).click();
    const fairSelect = page.locator("select[name='fairId']");
    await expect(fairSelect).toBeVisible();
    await fairSelect.selectOption({ label: "Bangkok Tech Fair 2026 · PUBLISHED" });

    await page.locator("input[name='name']").last().fill("Partner FinTech Booth");
    await page.locator("textarea[name='summary']").last().fill("Hiring Senior Engineers");
    await page.getByRole("button", { name: "Publish Booth" }).click();

    // Booth created successfully
    await expect(page.getByRole("heading", { name: "Partner FinTech Booth" })).toBeVisible();
  });
});

test.describe("Fair Membership Governance — Recruiter Access Request Flow", () => {
  test.describe.configure({ timeout: 90_000 });
  test("recruiter can request fair access and admin approves it", async ({ page }) => {
    // 1. Register Admin and create a published Fair
    await registerUser(page, {
      displayName: "Fair Lead",
      email: "fair-lead@test.local",
      password: "adminpassword123",
      role: "admin",
    });

    await page.goto("/admin/fairs");
    await createFair(page, {
      title: "AI Summit 2026",
      slug: "ai-summit-2026",
      location: "Bangkok",
      startsAt: "2026-11-01T09:00",
      endsAt: "2026-11-01T18:00",
      summary: "AI innovation expo",
    });
    await publishFirstFair(page);

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
    await expect(page.getByRole("button", { name: "คำขอรออนุมัติ 1" })).toBeVisible();

    // Open governance, go to pending tab and approve
    await page.getByRole("button", { name: /จัดการสมาชิกและคำขอทั้งหมด/ }).click();
    const governanceDialog = page.getByRole("dialog", { name: /ศูนย์จัดการสมาชิก/ });
    const pendingTab = governanceDialog.getByRole("button", { name: /รออนุมัติ/i });
    await pendingTab.click();

    const approveBtn = governanceDialog.getByRole("button", { name: "อนุมัติเข้าร่วม" });
    await approveBtn.click();

    // Verified approved
    await expect(governanceDialog.getByText("ไม่มีคำขอรออนุมัติ")).toBeVisible();
  });
});

test.describe("Fair Membership Governance — Accessibility", () => {
  test("admin fairs page with governance panel passes axe audit", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
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
    await page.emulateMedia({ reducedMotion: "reduce" });
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
