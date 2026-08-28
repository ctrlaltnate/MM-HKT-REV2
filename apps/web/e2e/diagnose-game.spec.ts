import { test, expect } from "@playwright/test";

test("Diagnose Phaser Career Hall canvas and console errors with real fair data", async ({ page }) => {
  const consoleLogs: string[] = [];
  const errors: string[] = [];

  page.on("console", (msg) => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  page.on("pageerror", (err) => {
    errors.push(`[PAGE ERROR] ${err.message}\n${err.stack}`);
  });

  // Navigate to root
  await page.goto("/", { waitUntil: "networkidle" });

  // Seed sample fair in localStorage
  await page.evaluate(() => {
    const STORAGE_KEY = "maskedmatch.local.database.v1";
    const sampleDb = {
      version: 1,
      sessionUserId: "user_cand_1",
      users: [
        {
          id: "user_cand_1",
          email: "candidate@example.com",
          displayName: "Dev Candidate",
          role: "candidate",
          createdAt: new Date().toISOString(),
          avatarConfig: {
            skinTone: "#D4956A",
            hairStyle: "short",
            hairColor: "#4A2E18",
            shirtColor: "#2563EB",
            pantsColor: "#1E293B",
            accessory: "backpack",
          },
        },
      ],
      candidateProfiles: [
        {
          userId: "user_cand_1",
          headline: "Fullstack Developer",
          region: "Bangkok",
          preferredWorkMode: "HYBRID",
          about: "Building scalable apps",
          manualSkills: ["React", "TypeScript", "Node.js"],
          shareWithJoinedFairs: true,
          updatedAt: new Date().toISOString(),
        },
      ],
      fairs: [
        {
          id: "fair_tech_2026",
          ownerId: "user_admin_1",
          title: "Tech Innovation Expo 2026",
          slug: "tech-expo-2026",
          summary: "มหกรรมจ็อบแฟร์เทคโนโลยีและนวัตกรรมดิจิทัลแห่งปี",
          locationLabel: "BITEC Bangna, Hall 98",
          startsAt: "2026-08-01T09:00:00.000Z",
          endsAt: "2026-08-30T18:00:00.000Z",
          status: "LIVE",
          createdAt: new Date().toISOString(),
        },
      ],
      memberships: [],
      companies: [
        { id: "comp_1", ownerId: "user_rec_1", name: "SCB TechX", industry: "Fintech", summary: "Leading fintech innovaton", website: "https://scbtechx.io", workLocations: "Bangkok", createdAt: new Date().toISOString() },
        { id: "comp_2", ownerId: "user_rec_2", name: "True Digital", industry: "Telecom", summary: "Digital transformation leader", website: "https://truedigital.com", workLocations: "Bangkok", createdAt: new Date().toISOString() },
        { id: "comp_3", ownerId: "user_rec_3", name: "Agoda", industry: "Travel Tech", summary: "Global travel platform", website: "https://agoda.com", workLocations: "Bangkok", createdAt: new Date().toISOString() },
        { id: "comp_4", ownerId: "user_rec_4", name: "Bitkub", industry: "Blockchain", summary: "Crypto exchange platform", website: "https://bitkub.com", workLocations: "Bangkok", createdAt: new Date().toISOString() },
        { id: "comp_5", ownerId: "user_rec_5", name: "LINE MAN Wongnai", industry: "E-Commerce", summary: "Food and on-demand delivery", website: "https://lmwn.com", workLocations: "Bangkok", createdAt: new Date().toISOString() },
        { id: "comp_6", ownerId: "user_rec_6", name: "Shopee Tech", industry: "E-Commerce", summary: "Leading shopping tech", website: "https://shopee.co.th", workLocations: "Bangkok", createdAt: new Date().toISOString() },
      ],
      booths: [
        { id: "b1", fairId: "fair_tech_2026", companyId: "comp_1", ownerId: "user_rec_1", name: "SCB TechX Booth", summary: "Fintech & Cloud Engineering", technologyTags: ["React", "Go"], accessibilityNote: "", status: "PUBLISHED", assignedJobIds: ["j1"], createdAt: new Date().toISOString() },
        { id: "b2", fairId: "fair_tech_2026", companyId: "comp_2", ownerId: "user_rec_2", name: "True Digital Booth", summary: "AI & IoT Solutions", technologyTags: ["Python", "AWS"], accessibilityNote: "", status: "PUBLISHED", assignedJobIds: ["j2"], createdAt: new Date().toISOString() },
        { id: "b3", fairId: "fair_tech_2026", companyId: "comp_3", ownerId: "user_rec_3", name: "Agoda Booth", summary: "High Scale Web Systems", technologyTags: ["React", "Java"], accessibilityNote: "", status: "PUBLISHED", assignedJobIds: ["j3"], createdAt: new Date().toISOString() },
        { id: "b4", fairId: "fair_tech_2026", companyId: "comp_4", ownerId: "user_rec_4", name: "Bitkub Booth", summary: "Web3 & Blockchain", technologyTags: ["Solidity", "Node.js"], accessibilityNote: "", status: "PUBLISHED", assignedJobIds: ["j4"], createdAt: new Date().toISOString() },
        { id: "b5", fairId: "fair_tech_2026", companyId: "comp_5", ownerId: "user_rec_5", name: "LMWN Booth", summary: "Logistics & Microservices", technologyTags: ["Go", "React"], accessibilityNote: "", status: "PUBLISHED", assignedJobIds: ["j5"], createdAt: new Date().toISOString() },
        { id: "b6", fairId: "fair_tech_2026", companyId: "comp_6", ownerId: "user_rec_6", name: "Shopee Tech Booth", summary: "Big Data & AI", technologyTags: ["Python", "Spark"], accessibilityNote: "", status: "PUBLISHED", assignedJobIds: ["j6"], createdAt: new Date().toISOString() },
      ],
      jobs: [
        { id: "j1", companyId: "comp_1", boothId: "b1", title: "Senior Frontend Engineer", summary: "Build modern web apps", mustHave: ["React", "TypeScript"], niceToHave: [], employmentType: "FULL_TIME", workMode: "HYBRID", salaryMin: 80000, salaryMax: 120000, status: "PUBLISHED", createdAt: new Date().toISOString() },
        { id: "j2", companyId: "comp_2", boothId: "b2", title: "Backend Golang Developer", summary: "Scalable microservices", mustHave: ["Go", "Docker"], niceToHave: [], employmentType: "FULL_TIME", workMode: "HYBRID", salaryMin: 90000, salaryMax: 130000, status: "PUBLISHED", createdAt: new Date().toISOString() },
        { id: "j3", companyId: "comp_3", boothId: "b3", title: "Fullstack Engineer", summary: "Global travel tech", mustHave: ["React", "Java"], niceToHave: [], employmentType: "FULL_TIME", workMode: "HYBRID", salaryMin: 100000, salaryMax: 150000, status: "PUBLISHED", createdAt: new Date().toISOString() },
        { id: "j4", companyId: "comp_4", boothId: "b4", title: "Smart Contract Developer", summary: "Solidity & DeFi", mustHave: ["Solidity", "TypeScript"], niceToHave: [], employmentType: "FULL_TIME", workMode: "REMOTE", salaryMin: 120000, salaryMax: 180000, status: "PUBLISHED", createdAt: new Date().toISOString() },
        { id: "j5", companyId: "comp_5", boothId: "b5", title: "DevOps Engineer", summary: "Kubernetes & CI/CD", mustHave: ["Kubernetes", "AWS"], niceToHave: [], employmentType: "FULL_TIME", workMode: "HYBRID", salaryMin: 85000, salaryMax: 140000, status: "PUBLISHED", createdAt: new Date().toISOString() },
        { id: "j6", companyId: "comp_6", boothId: "b6", title: "Data Scientist", summary: "Recommendation AI", mustHave: ["Python", "Machine Learning"], niceToHave: [], employmentType: "FULL_TIME", workMode: "HYBRID", salaryMin: 95000, salaryMax: 150000, status: "PUBLISHED", createdAt: new Date().toISOString() },
      ],
      applications: [],
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleDb));
  });

  // Navigate to fair detail page
  await page.goto("/fairs/fair_tech_2026", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);

  // 1. Walk using Keyboard (Arrow keys & WASD)
  await page.keyboard.down("ArrowRight");
  await page.waitForTimeout(400);
  await page.keyboard.up("ArrowRight");

  await page.keyboard.down("KeyS");
  await page.waitForTimeout(400);
  await page.keyboard.up("KeyS");

  // 2. Walk using Virtual D-Pad
  const upButton = page.locator('button[aria-label="เดินขึ้น"]');
  if (await upButton.isVisible()) {
    await upButton.hover();
    await page.mouse.down();
    await page.waitForTimeout(400);
    await page.mouse.up();
  }

  // 3. Walk using Click-to-Move on Grand Walkway
  await page.locator("#phaser-career-hall-canvas canvas").click({ position: { x: 260, y: 220 } });
  await page.waitForTimeout(1200);

  // Take screenshot of walking result
  await page.screenshot({ path: "game_walk_and_interact.png", fullPage: true });

  console.log("=== BROWSER CONSOLE LOGS ===");
  consoleLogs.forEach((log) => console.log(log));

  console.log("=== BROWSER PAGE ERRORS ===");
  errors.forEach((err) => console.log(err));

  expect(errors).toHaveLength(0);
});
