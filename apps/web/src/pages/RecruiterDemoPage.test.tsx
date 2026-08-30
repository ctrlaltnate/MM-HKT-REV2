import { describe, expect, it, afterEach, beforeEach, vi } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { RecruiterDemoPage, jobs } from "./RecruiterDemoPage";
import { sponsorCompanies } from "../data/companies";

describe("RecruiterDemoPage & Sponsor Job Catalog Tests", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("API_OFFLINE_FOR_TEST")));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    cleanup();
  });

  it("contains at least 4 jobs for every category", () => {
    const categories = ["Tech", "Business", "People", "Operations"] as const;
    for (const cat of categories) {
      const catJobs = jobs.filter((j) => j.category === cat);
      expect(catJobs.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("every sponsor company has values, culture, products, and perks", () => {
    const companies = Object.values(sponsorCompanies);
    expect(companies.length).toBeGreaterThanOrEqual(8);
    for (const comp of companies) {
      expect(comp.name).toBeTruthy();
      expect(comp.badge).toBeTruthy();
      expect(comp.values.length).toBeGreaterThanOrEqual(3);
      expect(comp.culture.length).toBeGreaterThanOrEqual(3);
      expect(comp.products.length).toBeGreaterThanOrEqual(3);
      expect(comp.perks.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("renders the initial catalog category view and opens company profile modal", () => {
    const { getByText, getByRole, queryByRole } = render(<RecruiterDemoPage />);

    // Check header and categories
    expect(getByText("เลือกหมวดหมู่งาน")).toBeInTheDocument();
    expect(getByText("Tech")).toBeInTheDocument();
    expect(getByText("Business")).toBeInTheDocument();
    expect(getByText("People")).toBeInTheDocument();
    expect(getByText("Operations")).toBeInTheDocument();

    // Click on Microsoft sponsor pill in the marquee
    const msftPill = getByRole("button", { name: /Microsoft/i });
    fireEvent.click(msftPill);

    // Verify company profile modal opens
    expect(getByRole("dialog", { name: "Microsoft (Thailand)" })).toBeInTheDocument();
    expect(getByText("ค่านิยมหลักขององค์กร (Core Values)")).toBeInTheDocument();
    expect(getByText("วัฒนธรรมและบรรยากาศการทำงาน (Work Culture)")).toBeInTheDocument();
    expect(getByText("ผลิตภัณฑ์และบริการหลัก (Products & Services)")).toBeInTheDocument();

    // Close modal
    const closeBtn = getByRole("button", { name: "ปิดหน้าต่าง" });
    fireEvent.click(closeBtn);
    expect(queryByRole("dialog", { name: "Microsoft (Thailand)" })).not.toBeInTheDocument();
  });

  it("allows selecting a category, picking a job, and viewing detailed JD", () => {
    const { getByText, getAllByRole } = render(<RecruiterDemoPage />);

    // Click Tech category card
    const techCategoryBtns = getAllByRole("button", { name: /Tech/i });
    const techCard = techCategoryBtns.find((b) => b.textContent?.includes("ตำแหน่งเปิดรับ"));
    expect(techCard).toBeDefined();
    fireEvent.click(techCard!);

    // Verify jobs in Tech are listed
    expect(getByText("Cloud & AI Solutions Architect")).toBeInTheDocument();
    expect(getByText("Senior Full-Stack Engineer")).toBeInTheDocument();
    expect(getByText("Frontend Design Engineer")).toBeInTheDocument();

    // Select the first job
    fireEvent.click(getByText("Cloud & AI Solutions Architect"));

    // Verify detailed JD content is displayed
    expect(getByText("เกี่ยวกับตำแหน่งและเป้าหมาย")).toBeInTheDocument();
    expect(getByText("หน้าที่ความรับผิดชอบหลัก")).toBeInTheDocument();
    expect(getByText("คุณสมบัติที่กำลังมองหา")).toBeInTheDocument();
    expect(getByText("สวัสดิการและสิ่งที่องค์กรส่งมอบ")).toBeInTheDocument();
  });

  it("allows opening company profile modal from job detail showcase button", () => {
    const { getByText, getByRole, getAllByRole } = render(<RecruiterDemoPage />);

    // 1. Click Tech category card
    const techCategoryBtns = getAllByRole("button", { name: /Tech/i });
    const techCard = techCategoryBtns.find((b) => b.textContent?.includes("ตำแหน่งเปิดรับ"));
    expect(techCard).toBeDefined();
    fireEvent.click(techCard!);

    // 2. Click job in list
    const jobCard = getByText("Cloud & AI Solutions Architect").closest("button");
    expect(jobCard).not.toBeNull();
    fireEvent.click(jobCard!);

    // 3. Find and click the "ดูข้อมูลบริษัท & Culture" button in the job detail header
    const compBtn = getByText("ดูข้อมูลบริษัท & Culture");
    expect(compBtn).toBeInTheDocument();
    fireEvent.click(compBtn);

    // Verify company profile dialog opens
    expect(getByRole("dialog")).toBeInTheDocument();
    expect(getByText("ค่านิยมหลักขององค์กร (Core Values)")).toBeInTheDocument();
    expect(getByText("สวัสดิการและสภาพแวดล้อม (Perks & Environment)")).toBeInTheDocument();
  });

  it("supports pre-assessment rules agreement and 15-minute quiz popup navigation", async () => {
    const { getByText, getByRole, getAllByRole, getAllByTitle, getAllByText, findByRole, findByText } = render(<RecruiterDemoPage />);

    // 1. Select Tech -> Job
    const techCategoryBtns = getAllByRole("button", { name: /Tech/i });
    const techCard = techCategoryBtns.find((b) => b.textContent?.includes("ตำแหน่งเปิดรับ"));
    expect(techCard).toBeDefined();
    fireEvent.click(techCard!);

    // Click first job in list
    fireEvent.click(getByText("Cloud & AI Solutions Architect"));

    // Verify detailed JD content is displayed
    expect(getByText("เกี่ยวกับตำแหน่งและเป้าหมาย")).toBeInTheDocument();

    // 2. Open Application CV intake modal
    const intakeBtn = getByText("แนบเรซูเม่และวิเคราะห์");
    fireEvent.click(intakeBtn);

    // 2.1 Load sample resume
    const sampleResumeBtn = getByRole("button", { name: /ใช้ตัวอย่าง Resume/i });
    fireEvent.click(sampleResumeBtn);

    // 3. Click Create Scenario Assessment
    const createBtn = getByRole("button", { name: /สร้าง Scenario Assessment/i });
    fireEvent.click(createBtn);

    // 4. Verify Assessment Rules in Checkpoint Modal
    expect(await findByText(/กฎระเบียบและข้อปฏิบัติก่อนเริ่มทำข้อสอบ/i, {}, { timeout: 4000 })).toBeInTheDocument();
    expect(getByText(/ห้ามทุจริต/i)).toBeInTheDocument();
    expect(getByText(/ห้ามสลับแท็บ \/ เปลี่ยนแอป/i)).toBeInTheDocument();
    expect(getByText(/บันทึก Security Audit Log/i)).toBeInTheDocument();

    const agreeCheckbox = getByRole("checkbox");
    expect(agreeCheckbox).not.toBeChecked();

    const confirmStartBtn = await findByRole("button", { name: /เริ่มทำแบบทดสอบ/i }, { timeout: 4000 });
    expect(confirmStartBtn).toBeDisabled();

    // Agree to rules
    fireEvent.click(agreeCheckbox);
    expect(confirmStartBtn).not.toBeDisabled();
    fireEvent.click(confirmStartBtn);

    // 5. Verify 15-Minute Assessment Stage is active
    expect(getByText(/Scenario Skills & Solution Check/i)).toBeInTheDocument();
    expect(getByRole("timer")).toBeInTheDocument();
    expect(getByText(/เวลาที่เหลือ/i)).toBeInTheDocument();
    expect(getByText(/Anti-Cheat: 100% Verified/i)).toBeInTheDocument();

    // 6. Verify Step Indicators and Counters
    expect(getByText("ข้อที่ 1")).toBeInTheDocument();
    expect(getByText(/ตอบแล้ว/i)).toBeInTheDocument();
    expect(getByText(/เหลืออีก/i)).toBeInTheDocument();

    // 7. Check 11 numbered jump pills (10 MCQs + 1 Subjective)
    const jumpButtons = getAllByTitle(/ข้อที่ \d+:/i);
    expect(jumpButtons.length).toBe(11);

    // 8. Select an option for Question 1
    const choiceCards = getAllByText(/^[A-D]$/);
    expect(choiceCards.length).toBe(4);
    fireEvent.click(choiceCards[0]!);

    // 9. Click Next to go to Question 2
    const nextBtn = getByRole("button", { name: /ข้อถัดไป/i });
    fireEvent.click(nextBtn);
    expect(getByText("ข้อที่ 2")).toBeInTheDocument();

    // 10. Click jump button 11 (Subjective question)
    fireEvent.click(jumpButtons[10]!);
    expect(getAllByText(/ข้อเขียนอัตนัย/i).length).toBeGreaterThanOrEqual(1);
    expect(getByRole("textbox")).toBeInTheDocument();
  });

  it("detects tab switching and displays the anti-cheat proctoring warning modal with audit logs", async () => {
    const { getByText, getByRole, getAllByRole, findByRole, findByText, queryByRole } = render(<RecruiterDemoPage />);

    // 1. Select Tech -> Job -> Intake -> Confirm
    const techCategoryBtns = getAllByRole("button", { name: /Tech/i });
    const techCard = techCategoryBtns.find((b) => b.textContent?.includes("ตำแหน่งเปิดรับ"));
    fireEvent.click(techCard!);

    fireEvent.click(getByText("Cloud & AI Solutions Architect"));
    fireEvent.click(getByText("แนบเรซูเม่และวิเคราะห์"));
    fireEvent.click(getByRole("button", { name: /ใช้ตัวอย่าง Resume/i }));
    fireEvent.click(getByRole("button", { name: /สร้าง Scenario Assessment/i }));

    // 2. Agree and start
    const agreeCheckbox = await findByRole("checkbox", {}, { timeout: 4000 });
    fireEvent.click(agreeCheckbox);
    const startBtn = getByRole("button", { name: /เริ่มทำแบบทดสอบ/i });
    fireEvent.click(startBtn);

    // 3. Verify clean anti-cheat status in header
    expect(getByText(/Anti-Cheat: 100% Verified/i)).toBeInTheDocument();

    // 4. Simulate tab switch out (document.hidden = true)
    Object.defineProperty(document, "hidden", { value: true, writable: true, configurable: true });
    fireEvent(document, new Event("visibilitychange"));

    // 5. Simulate tab switch back in (document.hidden = false)
    Object.defineProperty(document, "hidden", { value: false, writable: true, configurable: true });
    fireEvent(document, new Event("visibilitychange"));

    // 6. Verify Tab Warning Modal opens
    expect(await findByRole("alertdialog", {}, { timeout: 4000 })).toBeInTheDocument();
    expect(getByText(/ตรวจพบการสลับหน้าจอ \/ ออกจากแอป!/i)).toBeInTheDocument();
    expect(getByText(/พฤติกรรมนี้ถูกบันทึกประวัติ \(Audit Log\) แล้ว/i)).toBeInTheDocument();
    expect(getByText(/ตรวจพบครั้งที่/i)).toBeInTheDocument();

    // 7. Acknowledge and dismiss warning
    const ackBtn = getByRole("button", { name: /รับทราบและกลับไปทำข้อสอบต่อ/i });
    fireEvent.click(ackBtn);
    expect(queryByRole("alertdialog")).not.toBeInTheDocument();

    // 8. Verify anti-cheat status now indicates tab switch flagged
    expect(getByText(/สลับแท็บ 1 ครั้ง/i)).toBeInTheDocument();
  });
});
