import { ArrowLeft, Gamepad2, Info, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import type { Booth, Company, JobPosting } from "@maskedmatch/contracts";

import { PhaserGameHost } from "../game/PhaserGameHost";
import { useToast } from "../context/ToastContext";

const createdAt = "2026-08-29T00:00:00.000Z";

const companies: Company[] = [
  { id: "demo-company-nova", ownerId: "demo", name: "Nova Byte Studio", industry: "Software & Digital Products", summary: "ทีมผลิตภัณฑ์ดิจิทัลที่สร้างแพลตฟอร์มสำหรับธุรกิจไทย เน้นคุณภาพซอฟต์แวร์และการทำงานแบบทดลองเร็ว", website: "https://example.com/nova", workLocations: "Bangkok · Hybrid", createdAt },
  { id: "demo-company-green", ownerId: "demo", name: "GreenLoop Commerce", industry: "Sustainable Commerce", summary: "แพลตฟอร์มค้าปลีกที่ใช้ข้อมูลลดของเสียและช่วยให้ร้านค้าบริหารสินค้าได้แม่นยำขึ้น", website: "https://example.com/greenloop", workLocations: "Thailand · Remote friendly", createdAt },
];

const booths: Booth[] = [
  { id: "demo-booth-nova", fairId: "public-demo-hall", companyId: companies[0]!.id, ownerId: "demo", name: "Nova Byte Lab", summary: "Software product booth", technologyTags: ["React", "Design", "QA"], accessibilityNote: "Keyboard and click navigation", status: "PUBLISHED", assignedJobIds: ["job-frontend", "job-ux", "job-qa"], createdAt },
  { id: "demo-booth-green", fairId: "public-demo-hall", companyId: companies[1]!.id, ownerId: "demo", name: "GreenLoop Hub", summary: "Sustainable commerce booth", technologyTags: ["Data", "Growth", "Operations"], accessibilityNote: "Keyboard and click navigation", status: "PUBLISHED", assignedJobIds: ["job-data", "job-marketing", "job-ops"], createdAt },
];

const job = (input: Partial<JobPosting> & Pick<JobPosting, "id" | "companyId" | "boothId" | "title" | "summary" | "mustHave">): JobPosting => ({ responsibilities: input.summary, niceToHave: [], salaryMin: 35000, salaryMax: 65000, workMode: "HYBRID", employmentType: "FULL_TIME", status: "PUBLISHED", createdAt, ...input });
const jobs: JobPosting[] = [
  job({ id: "job-frontend", companyId: companies[0]!.id, boothId: booths[0]!.id, title: "Frontend Developer", summary: "สร้างเว็บแอปด้วย React และ TypeScript พร้อมดูแล performance", mustHave: ["React", "TypeScript", "Testing"], salaryMin: 55000, salaryMax: 85000 }),
  job({ id: "job-ux", companyId: companies[0]!.id, boothId: booths[0]!.id, title: "UX/UI Designer", summary: "ออกแบบประสบการณ์ใช้งานจาก research จนถึง design system", mustHave: ["Figma", "User Research", "Design System"], salaryMin: 45000, salaryMax: 70000 }),
  job({ id: "job-qa", companyId: companies[0]!.id, boothId: booths[0]!.id, title: "QA Engineer", summary: "วางแผนทดสอบและสร้าง automation สำหรับ product delivery", mustHave: ["Test Design", "Automation", "API Testing"], salaryMin: 45000, salaryMax: 68000 }),
  job({ id: "job-data", companyId: companies[1]!.id, boothId: booths[1]!.id, title: "Data Analyst", summary: "วิเคราะห์ข้อมูลสินค้าและสร้าง dashboard เพื่อการตัดสินใจ", mustHave: ["SQL", "Dashboard", "Statistics"], salaryMin: 48000, salaryMax: 72000, workMode: "REMOTE" }),
  job({ id: "job-marketing", companyId: companies[1]!.id, boothId: booths[1]!.id, title: "Growth Marketing", summary: "ทดลองแคมเปญและปรับ funnel จากข้อมูล conversion", mustHave: ["Campaign", "Analytics", "Content"], salaryMin: 40000, salaryMax: 65000, workMode: "REMOTE" }),
  job({ id: "job-ops", companyId: companies[1]!.id, boothId: booths[1]!.id, title: "Customer Operations", summary: "ดูแลคุณภาพบริการ SLA และปรับปรุงกระบวนการลูกค้า", mustHave: ["Customer Service", "SLA", "Process Improvement"], salaryMin: 38000, salaryMax: 58000, workMode: "REMOTE" }),
];

export function GameHallDemoPage() {
  const { toast } = useToast();
  return (
    <main className="game-demo-page">
      <div className="game-demo-floating-nav">
        <Link to="/"><ArrowLeft aria-hidden="true" /> กลับหน้า Landing</Link>
        <span><ShieldCheck aria-hidden="true" /> PUBLIC SYNTHETIC DEMO</span>
      </div>
      <div className="game-demo-intro">
        <div><span><Gamepad2 aria-hidden="true" /> PLAYABLE CAREER HALL</span><h1>เดินสำรวจ 2 บูธ · ดูงาน 6 ตำแหน่ง</h1></div>
        <p><Info aria-hidden="true" /> ใช้ WASD / ลูกศร / คลิกบนพื้นเพื่อเดิน เมื่อเข้าใกล้บูธให้กด E หรือปุ่มสีเหลืองเพื่อเปิดข้อมูลตำแหน่งงาน</p>
      </div>
      <div className="game-demo-stage">
        <PhaserGameHost fairId="public-demo-hall" fairTitle="MaskedMatch Public Demo Hall" booths={booths.map((booth, index) => ({ ...booth, tableNumber: index + 1 }))} companies={companies} jobs={jobs} onApply={(selectedJob) => toast.info(`เดโม่: เลือกดูตำแหน่ง ${selectedJob.title} แล้ว — ยังไม่มีการส่งใบสมัครจริง`)} />
      </div>
    </main>
  );
}
