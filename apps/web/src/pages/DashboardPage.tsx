import { ArrowRight, Building2, CalendarDays, Check, FileUser, ShieldCheck } from "lucide-react";

import { AnimatedPage } from "../components/AnimatedPage";
import { PixelLink, PixelSurface, StatusPill } from "../components/PixelUI";
import { useApp } from "../context/AppContext";

export function DashboardPage() {
  const { user, database } = useApp();
  if (!user) return null;

  const profile = database.candidateProfiles.find((item) => item.userId === user.id);
  const memberships = database.memberships.filter((item) => item.userId === user.id);
  const company = database.companies.find((item) => item.ownerId === user.id);
  const ownedBooths = database.booths.filter((item) => item.ownerId === user.id);
  const ownedFairs = database.fairs.filter((item) => item.ownerId === user.id);

  const candidateSteps = [
    { label: "สร้างข้อมูลพื้นฐาน", complete: Boolean(profile?.headline) },
    { label: "อัปโหลด Resume PDF", complete: Boolean(profile?.resume) },
    { label: "วิเคราะห์ทักษะ", complete: Boolean(profile?.resume?.analysis) },
    { label: "อนุญาตแชร์ Masked summary", complete: Boolean(profile?.shareWithJoinedFairs) },
    { label: "เข้าร่วม Job Fair", complete: memberships.length > 0 },
  ];

  return (
    <AnimatedPage className="page-shell">
      <div className="page-header" data-reveal>
        <span className="eyebrow">Workspace</span>
        <h1>สวัสดี {user.displayName}</h1>
        <p>ข้อมูลของคุณถูกจดจำใน browser เครื่องนี้ เลือกงานถัดไปตามบทบาทของบัญชี</p>
      </div>

      {user.role === "candidate" ? (
        <div className="dashboard-grid">
          <PixelSurface data-reveal>
            <StatusPill tone={profile?.resume?.analysis ? "cyan" : "mango"}>
              {profile?.resume?.analysis ? "Profile analyzed" : "Profile incomplete"}
            </StatusPill>
            <h2>ความพร้อมของผู้สมัคร</h2>
            <ul className="progress-list">
              {candidateSteps.map((step) => (
                <li className={step.complete ? "progress-item complete" : "progress-item"} key={step.label}>
                  <span className="progress-check">{step.complete ? <Check aria-hidden="true" /> : ""}</span>
                  <span>{step.label}</span>
                  <StatusPill tone={step.complete ? "cyan" : "neutral"}>
                    {step.complete ? "พร้อม" : "รอดำเนินการ"}
                  </StatusPill>
                </li>
              ))}
            </ul>
            <PixelLink to="/candidate/profile" tone="mango">
              <FileUser aria-hidden="true" /> เปิดประวัติของฉัน
            </PixelLink>
          </PixelSurface>
          <PixelSurface data-reveal>
            <CalendarDays aria-hidden="true" />
            <h2>งานแฟร์ของฉัน</h2>
            <strong>{memberships.length} งาน</strong>
            <p>เข้าร่วมงานใหม่ได้หลังมีบัญชี และเพิ่ม Resume analysis เพื่อให้บริษัทเห็น skill summary ที่ครบขึ้น</p>
            <PixelLink to="/fairs" tone="neutral">ค้นหางานแฟร์ <ArrowRight aria-hidden="true" /></PixelLink>
          </PixelSurface>
        </div>
      ) : null}

      {user.role === "recruiter" ? (
        <div className="dashboard-grid">
          <PixelSurface data-reveal>
            <Building2 aria-hidden="true" />
            <h2>{company?.name ?? "เริ่มสร้างบริษัทของคุณ"}</h2>
            <p>{company?.summary ?? "เพิ่มข้อมูลบริษัทก่อนสร้างบูธและตำแหน่งงานใน Job Fair"}</p>
            <PixelLink to="/recruiter/workspace" tone="mango">จัดการบริษัทและบูธ</PixelLink>
          </PixelSurface>
          <PixelSurface data-reveal className="metric-card">
            <strong>{ownedBooths.length}</strong>
            <span>บูธที่สร้างแล้ว</span>
            <p>แต่ละบูธผูกกับงานแฟร์หนึ่งงานและมีตำแหน่งงานได้หลายตำแหน่ง</p>
          </PixelSurface>
        </div>
      ) : null}

      {user.role === "admin" ? (
        <div className="dashboard-grid">
          <PixelSurface data-reveal>
            <ShieldCheck aria-hidden="true" />
            <h2>ศูนย์จัดการ Job Fair</h2>
            <p>สร้างกำหนดการ เปิดเผยงานให้ Recruiter และ Candidate และดูจำนวนบูธ/สมาชิกในแต่ละงาน</p>
            <PixelLink to="/admin/fairs" tone="mango">จัดการงานแฟร์</PixelLink>
          </PixelSurface>
          <PixelSurface data-reveal className="metric-card">
            <strong>{ownedFairs.length}</strong>
            <span>งานแฟร์ที่สร้างแล้ว</span>
          </PixelSurface>
        </div>
      ) : null}
    </AnimatedPage>
  );
}
