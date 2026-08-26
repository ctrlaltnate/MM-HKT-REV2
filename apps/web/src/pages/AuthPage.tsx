import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AnimatedPage } from "../components/AnimatedPage";
import { AuthForm } from "../components/AuthForm";
import { PixelSurface } from "../components/PixelUI";

export function AuthPage() {
  const navigate = useNavigate();
  return (
    <AnimatedPage className="page-shell">
      <div className="auth-layout">
        <div className="auth-side" data-reveal>
          <span className="eyebrow">Membership</span>
          <div className="page-header">
            <h1>บัญชีเดียวสำหรับทุกงานแฟร์</h1>
            <p>เลือกบทบาท สร้างโปรไฟล์หรือจัดการงาน และกลับมาใช้งานต่อจาก browser เครื่องเดิมได้</p>
          </div>
          <div className="notice"><Info aria-hidden="true" /><span>Local identity: ข้อมูลบัญชีอยู่ใน browser เครื่องนี้ ยังไม่เชื่อม ThaID, OTP หรือเซิร์ฟเวอร์บัญชีกลาง</span></div>
        </div>
        <PixelSurface data-reveal>
          <AuthForm onComplete={() => navigate("/app")} />
        </PixelSurface>
      </div>
    </AnimatedPage>
  );
}
