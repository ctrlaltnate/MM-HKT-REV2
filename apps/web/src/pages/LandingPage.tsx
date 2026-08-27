import { useState } from "react";
import {
  ArrowRight,
  CalendarPlus,
  CheckCircle2,
  FileSearch,
  ScanSearch,
  ShieldCheck,
  Store,
  UsersRound,
} from "lucide-react";
import type { JobFair } from "@maskedmatch/contracts";

import { AnimatedPage } from "../components/AnimatedPage";
import { GlassPanel } from "../components/GlassPanel";
import { LandingJourneyMotion } from "../components/LandingJourneyMotion";
import { PixelHallArt } from "../components/PixelHallArt";
import { PixelButton, PixelLink, PixelSurface, StatusPill } from "../components/PixelUI";
import { InteractiveSkillSimulator } from "../components/InteractiveSkillSimulator";
import { FairQuickPreviewModal } from "../components/FairQuickPreviewModal";
import { DashboardPage } from "./DashboardPage";
import { useApp } from "../context/AppContext";
import { useAuthModal } from "../context/AuthModalContext";

export function LandingPage() {
  const { user, database } = useApp();
  const { openAuthModal } = useAuthModal();
  const [previewFair, setPreviewFair] = useState<JobFair | null>(null);

  // If user is logged in, show personalized role dashboard as the home page
  if (user) {
    return <DashboardPage />;
  }

  const publicFairs = database.fairs.filter((fair) => fair.status === "PUBLISHED" || fair.status === "LIVE");
  const publicFairIds = new Set(publicFairs.map((fair) => fair.id));
  const publicBooths = database.booths.filter((booth) => booth.status === "PUBLISHED" && publicFairIds.has(booth.fairId));
  const publicBoothIds = new Set(publicBooths.map((booth) => booth.id));
  const publicJobs = database.jobs.filter((job) => job.status === "PUBLISHED" && publicBoothIds.has(job.boothId));

  return (
    <AnimatedPage>
      <section className="hero" aria-labelledby="landing-title">
        <div className="hero-copy">
          <span className="eyebrow" data-reveal>Skills-first online job fair</span>
          <h1 id="landing-title" data-reveal>
            ให้ทักษะพาคุณ
            <span>ไปเจองานที่ใช่</span>
          </h1>
          <p data-reveal>
            เปลี่ยน Resume PDF ให้เป็นสรุปทักษะพร้อมหลักฐาน เข้าร่วมงานแฟร์ได้หลายงาน
            และเลือกเองว่าจะให้ Recruiter เห็นข้อมูลแบบ Masked เมื่อใด
          </p>

          <div className="hero-actions" data-reveal>
            {user ? (
              <PixelLink to="/app" tone="mango">เปิดพื้นที่ทำงาน <ArrowRight aria-hidden="true" /></PixelLink>
            ) : (
              <PixelButton type="button" tone="mango" onClick={() => openAuthModal("register")}>
                สร้างบัญชีและเริ่มใช้งาน <ArrowRight aria-hidden="true" />
              </PixelButton>
            )}
            <PixelLink to="/fairs" tone="neutral">สำรวจงานแฟร์</PixelLink>
          </div>

          <ul className="hero-assurances" data-reveal aria-label="จุดเด่นของระบบ">
            <li><CheckCircle2 aria-hidden="true" /> อ่าน PDF ใน browser ก่อนส่งวิเคราะห์</li>
            <li><CheckCircle2 aria-hidden="true" /> ขอความยินยอมก่อนแชร์ให้บริษัท</li>
            <li><CheckCircle2 aria-hidden="true" /> หนึ่งบัญชีเข้าร่วมได้หลายงาน</li>
          </ul>
        </div>

        <div className="hero-visual" data-reveal>
          <div className="liquid-logo-accent" data-float aria-hidden="true">
            <GlassPanel>
              <img src="/assets/brand/maskedmatch-logo.png" alt="" />
            </GlassPanel>
          </div>
          <div className="hero-showcase">
            <div className="hero-showcase-bar">
              <div>
                <span className="window-dot cyan" />
                <span className="window-dot violet" />
                <span className="window-dot mango" />
              </div>
              <span>CAREER FAIR DIRECTORY</span>
              <img src="/assets/brand/maskedmatch-logo.png" alt="" aria-hidden="true" />
            </div>
            <PixelHallArt />
            <div className="hero-showcase-footer">
              <button
                type="button"
                className="showcase-stat-btn"
                onClick={() => {
                  const firstFair = publicFairs[0];
                  if (firstFair) setPreviewFair(firstFair);
                }}
                title="กดเพื่อดูตัวอย่างงานแฟร์"
              >
                <strong>{publicFairs.length}</strong>
                <span>งานแฟร์ที่เปิดอยู่ ↗</span>
              </button>
              <div><strong>{publicBooths.length}</strong><span>บูธบริษัท</span></div>
              <div><strong>{publicJobs.length}</strong><span>ตำแหน่งงาน</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band" aria-labelledby="flow-title">
        <div className="section-inner">
          <div className="section-heading landing-heading" data-reveal>
            <div>
              <span className="eyebrow">Profile → Evidence → Fair</span>
              <h2 id="flow-title">เตรียมโปรไฟล์ให้พร้อมก่อนวันงาน</h2>
            </div>
            <p>ทุกขั้นอยู่บนเว็บและกลับมาทำต่อได้ โดย Career Hall จะเริ่มหลังข้อมูลและงานแฟร์พร้อม</p>
          </div>

          <LandingJourneyMotion />

          <div className="landing-flow">
            <PixelSurface data-reveal>
              <div className="landing-step-head"><span className="feature-number">01</span><FileSearch aria-hidden="true" /></div>
              <h3>อ่าน Resume PDF</h3>
              <p>ตรวจชื่อไฟล์ ขนาด และข้อความที่อ่านได้ในเครื่องก่อนเลือกส่งไปวิเคราะห์</p>
              <ul className="benefit-list"><li>เห็นข้อความก่อนส่ง API</li><li>ลดความเสี่ยงจากไฟล์ผิด</li></ul>
            </PixelSurface>
            <div className="flow-connector" aria-hidden="true"><ArrowRight /></div>
            <PixelSurface data-reveal>
              <div className="landing-step-head"><span className="feature-number">02</span><ScanSearch aria-hidden="true" /></div>
              <h3>สรุปจากหลักฐาน</h3>
              <p>ระบบ AI คืน structured summary, skills, ระดับความมั่นใจ และจุดที่ควรถามเพิ่ม</p>
              <ul className="benefit-list"><li>อ่านจุดแข็งได้ในไม่กี่นาที</li><li>อ้างอิงหลักฐานจาก Resume</li></ul>
            </PixelSurface>
            <div className="flow-connector" aria-hidden="true"><ArrowRight /></div>
            <PixelSurface data-reveal>
              <div className="landing-step-head"><span className="feature-number">03</span><UsersRound aria-hidden="true" /></div>
              <h3>แชร์แบบ Masked</h3>
              <p>Recruiter ในงานเดียวกันเห็นเฉพาะสรุปที่ได้รับ consent ไม่เห็น PDF หรือข้อมูลติดต่อ</p>
              <ul className="benefit-list"><li>เริ่มคุยจากทักษะ</li><li>เปิดเผยข้อมูลเมื่อพร้อม</li></ul>
            </PixelSurface>
          </div>

          {/* Interactive Skill Simulator Playground */}
          <InteractiveSkillSimulator />
        </div>
      </section>

      <section className="page-shell landing-roles" aria-labelledby="roles-title">
        <div className="section-heading landing-heading" data-reveal>
          <div>
            <span className="eyebrow">Three workspaces</span>
            <h2 id="roles-title">ทุกฝ่ายเตรียมงานจากที่เดียว</h2>
          </div>
          <p>ข้อมูลบริษัท บูธ ตำแหน่ง และสมาชิกเชื่อมกับ Job Fair เดียวกันบนเครื่องนี้</p>
        </div>

        <div className="role-grid">
          <PixelSurface className="role-card candidate" data-reveal>
            <div className="role-card-media">
              <img src="/assets/roles/candidate_role.jpg" alt="ภาพประกอบ Candidate Workspace" loading="lazy" />
            </div>
            <StatusPill tone="cyan">Candidate</StatusPill>
            <h3>สร้างประวัติและเลือกการแชร์</h3>
            <p>
              เปลี่ยน Resume PDF ให้เป็นโปรไฟล์ทักษะที่นำกลับมาต่อยอดได้ พร้อมระบบ AI สกัดหลักฐานความเชี่ยวชาญ และเลือกเปิดเผยข้อมูลให้บริษัทแบบ Masked เมื่อยินยอม
            </p>
            <ul className="benefit-list">
              <li>วิเคราะห์ Resume ด้วยระบบ AI</li>
              <li>เก็บประวัติและงานแฟร์ที่เข้าร่วม</li>
              <li>ควบคุม Consent และความเป็นส่วนตัว</li>
            </ul>
          </PixelSurface>

          <PixelSurface className="role-card recruiter" data-reveal>
            <div className="role-card-media">
              <img src="/assets/roles/recruiter_role.jpg" alt="ภาพประกอบ Recruiter Workspace" loading="lazy" />
            </div>
            <StatusPill tone="violet">Recruiter</StatusPill>
            <h3>เปิดบูธและค้นหาทักษะที่ใช่</h3>
            <p>
              จัดการบูธบริษัทและตำแหน่งงานใน Career Fair พร้อมดู Candidate Board ที่คัดกรองจากทักษะและ Job Description อย่างเป็นธรรมก่อนเปิดเผยข้อมูลส่วนตัว
            </p>
            <ul className="benefit-list">
              <li>จัดการหลายบูธตามงานแฟร์</li>
              <li>ระบุเงินเดือนและ skill requirements</li>
              <li>เห็นเฉพาะโปรไฟล์ที่ยินยอม</li>
            </ul>
          </PixelSurface>

          <PixelSurface className="role-card admin" data-reveal>
            <div className="role-card-media">
              <img src="/assets/roles/admin_role.jpg" alt="ภาพประกอบ Admin Operations Center" loading="lazy" />
            </div>
            <StatusPill tone="mango">Admin</StatusPill>
            <h3>จัดและบริหาร Virtual Job Fair</h3>
            <p>
              ควบคุมวงจรงานแฟร์ตั้งแต่การตั้งค่า Draft, กำหนดเวลาเปิด-ปิดงาน, อนุมัติสิทธิ์ Recruiter และติดตามภาพรวมความเคลื่อนไหวทั้งหมดจากศูนย์ควบคุมเดียว
            </p>
            <ul className="benefit-list">
              <li>กำหนดการเปิด–ปิดงานแฟร์แบบกำหนดเวลา</li>
              <li>จัดการสิทธิ์และคำขอเข้าร่วมของ Recruiter</li>
              <li>มอนิเตอร์สถานะบูธและผู้ร่วมงานแบบรวมศูนย์</li>
            </ul>
          </PixelSurface>
        </div>
      </section>

      <section className="page-shell landing-trust" aria-labelledby="trust-title">
        <PixelSurface className="trust-banner" data-reveal>
          <div>
            <ShieldCheck aria-hidden="true" />
            <span className="eyebrow">Privacy by choice</span>
            <h2 id="trust-title">แสดงความสามารถก่อนข้อมูลส่วนตัวที่ไม่จำเป็น</h2>
          </div>
          <p>
            AI ช่วยสกัดข้อมูลจากเอกสาร ไม่ตัดสินใจรับงานแทนคน ผู้สมัครเป็นผู้เปิดการแชร์เอง
            และ Local identity รุ่นนี้ไม่อ้างว่าเป็น ThaID หรือระบบสมาชิกส่วนกลาง
          </p>
          {user ? (
            <PixelLink to="/app" tone="mango">กลับไปทำงานต่อ <ArrowRight aria-hidden="true" /></PixelLink>
          ) : (
            <PixelButton type="button" tone="mango" onClick={() => openAuthModal("register")}>
              เริ่มสร้างโปรไฟล์ <ArrowRight aria-hidden="true" />
            </PixelButton>
          )}
        </PixelSurface>
      </section>

      {/* Quick Preview Modal */}
      <FairQuickPreviewModal
        fair={previewFair}
        booths={database.booths}
        jobs={database.jobs}
        open={Boolean(previewFair)}
        onClose={() => setPreviewFair(null)}
      />
    </AnimatedPage>
  );
}
