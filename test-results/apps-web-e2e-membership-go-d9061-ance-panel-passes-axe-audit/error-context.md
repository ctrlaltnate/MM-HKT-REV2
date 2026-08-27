# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apps\web\e2e\membership-governance.spec.ts >> Fair Membership Governance — Accessibility >> admin fairs page with governance panel passes axe audit
- Location: apps\web\e2e\membership-governance.spec.ts:171:3

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | import AxeBuilder from "@axe-core/playwright";
  3   | import { resetAppState, registerUser, openProfileDropdown } from "./helpers";
  4   | 
  5   | test.beforeEach(async ({ page }) => {
> 6   |   await page.goto("/");
      |              ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  7   |   await resetAppState(page);
  8   | });
  9   | 
  10  | test.describe("Fair Membership Governance — Recruiter Invitation Flow", () => {
  11  |   test("admin can invite recruiter by email and recruiter can accept invitation to open booth", async ({ page }) => {
  12  |     // 1. Register Admin and create a Fair
  13  |     await registerUser(page, {
  14  |       displayName: "Admin Organizer",
  15  |       email: "org-admin@test.local",
  16  |       password: "adminpassword123",
  17  |       role: "admin",
  18  |     });
  19  | 
  20  |     await page.goto("/admin/fairs");
  21  |     await expect(page).toHaveURL(/\/admin\/fairs/);
  22  | 
  23  |     // Create a new fair
  24  |     await page.locator("input[name='title']").fill("Bangkok Tech Fair 2026");
  25  |     await page.locator("input[name='slug']").fill("bkk-tech-2026");
  26  |     await page.locator("input[name='locationLabel']").fill("Online");
  27  |     await page.locator("input[name='startsAt']").fill("2026-10-01T09:00");
  28  |     await page.locator("input[name='endsAt']").fill("2026-10-01T18:00");
  29  |     await page.locator("textarea[name='summary']").fill("Annual tech hiring expo");
  30  |     await page.getByRole("button", { name: "สร้าง Draft" }).click();
  31  | 
  32  |     // Publish the fair so it becomes available
  33  |     const publishButton = page.getByRole("button", { name: "Publish" }).first();
  34  |     await expect(publishButton).toBeVisible();
  35  |     await publishButton.click();
  36  | 
  37  |     // 2. Admin invites recruiter by email
  38  |     const inviteTabBtn = page.getByRole("button", { name: /ส่งคำเชิญ/i }).first();
  39  |     await inviteTabBtn.click();
  40  | 
  41  |     const emailInput = page.getByLabel("อีเมล Recruiter ที่ต้องการเชิญ");
  42  |     await emailInput.fill("partner.recruiter@company.com");
  43  |     await page.getByRole("button", { name: "ส่งคำเชิญ" }).click();
  44  | 
  45  |     await expect(page.getByText(/ส่งคำเชิญไปยัง partner.recruiter@company.com/)).toBeVisible();
  46  | 
  47  |     // 3. Logout Admin
  48  |     await openProfileDropdown(page);
  49  |     await Promise.all([
  50  |       page.waitForURL(/\/$/),
  51  |       page.locator(".profile-dropdown").getByRole("menuitem", { name: "ออกจากระบบ" }).click(),
  52  |     ]);
  53  | 
  54  |     // 4. Register as the invited Recruiter
  55  |     await registerUser(page, {
  56  |       displayName: "Partner Recruiter",
  57  |       email: "partner.recruiter@company.com",
  58  |       password: "recruiterpassword123",
  59  |       role: "recruiter",
  60  |     });
  61  | 
  62  |     await page.goto("/recruiter/workspace");
  63  |     await expect(page).toHaveURL(/\/recruiter\/workspace/);
  64  | 
  65  |     // Verify invitation banner is visible
  66  |     await expect(page.getByText("คุณได้รับคำเชิญเข้าร่วม Job Fair!")).toBeVisible();
  67  |     await expect(page.getByText("Bangkok Tech Fair 2026")).toBeVisible();
  68  | 
  69  |     // Accept invitation
  70  |     await page.getByRole("button", { name: "ตอบรับคำเชิญ" }).first().click();
  71  | 
  72  |     // Fill Company profile
  73  |     await page.locator("input[name='name']").first().fill("Partner Tech Co.");
  74  |     await page.locator("input[name='industry']").fill("FinTech");
  75  |     await page.locator("input[name='workLocations']").fill("Bangkok");
  76  |     await page.locator("textarea[name='summary']").first().fill("Leading fintech innovators");
  77  |     await page.getByRole("button", { name: "บันทึกบริษัท" }).click();
  78  | 
  79  |     // Verify Fair is now selectable in Booth creation
  80  |     const fairSelect = page.locator("select[name='fairId']");
  81  |     await expect(fairSelect).toBeVisible();
  82  |     await fairSelect.selectOption({ label: "Bangkok Tech Fair 2026 · PUBLISHED" });
  83  | 
  84  |     await page.locator("input[name='name']").nth(1).fill("Partner FinTech Booth");
  85  |     await page.locator("textarea[name='summary']").nth(1).fill("Hiring Senior Engineers");
  86  |     await page.getByRole("button", { name: "Publish Booth" }).click();
  87  | 
  88  |     // Booth created successfully
  89  |     await expect(page.getByText("Partner FinTech Booth")).toBeVisible();
  90  |   });
  91  | });
  92  | 
  93  | test.describe("Fair Membership Governance — Recruiter Access Request Flow", () => {
  94  |   test("recruiter can request fair access and admin approves it", async ({ page }) => {
  95  |     // 1. Register Admin and create a published Fair
  96  |     await registerUser(page, {
  97  |       displayName: "Fair Lead",
  98  |       email: "fair-lead@test.local",
  99  |       password: "adminpassword123",
  100 |       role: "admin",
  101 |     });
  102 | 
  103 |     await page.goto("/admin/fairs");
  104 |     await page.locator("input[name='title']").fill("AI Summit 2026");
  105 |     await page.locator("input[name='slug']").fill("ai-summit-2026");
  106 |     await page.locator("input[name='locationLabel']").fill("Bangkok");
```