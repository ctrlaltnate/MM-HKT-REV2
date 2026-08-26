import { KeyRound, Save, UserRoundCog } from "lucide-react";
import { type FormEvent, useState } from "react";

import { AnimatedPage } from "../components/AnimatedPage";
import { Field, PixelButton, PixelLink, PixelSurface, StatusPill } from "../components/PixelUI";
import { ProfileAvatar } from "../components/ProfileAvatar";
import { useApp } from "../context/AppContext";

const roleLabels = { candidate: "Job Seeker", recruiter: "Recruiter", admin: "Admin" };

export function AccountSettingsPage() {
  const { user, actions } = useApp();
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  if (!user) return null;

  const saveAccount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      actions.updateUser(user.id, { displayName: String(form.get("displayName")), email: String(form.get("email")) });
      setProfileMessage("บันทึกข้อมูลบัญชีแล้ว");
    } catch (cause) {
      setProfileMessage(cause instanceof Error && cause.message === "EMAIL_EXISTS" ? "อีเมลนี้ถูกใช้งานแล้ว" : "บันทึกไม่สำเร็จ");
    }
  };

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = String(form.get("nextPassword"));
    if (next !== String(form.get("confirmPassword"))) {
      setPasswordMessage("รหัสผ่านใหม่ทั้งสองช่องไม่ตรงกัน");
      return;
    }
    try {
      await actions.changePassword(user.id, String(form.get("currentPassword")), next);
      event.currentTarget.reset();
      setPasswordMessage("เปลี่ยนรหัสผ่านแล้ว");
    } catch (cause) {
      const code = cause instanceof Error ? cause.message : "";
      setPasswordMessage(code === "INVALID_CREDENTIALS" ? "รหัสผ่านปัจจุบันไม่ถูกต้อง" : code === "PASSWORD_TOO_SHORT" ? "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร" : "เปลี่ยนรหัสผ่านไม่สำเร็จ");
    }
  };

  const workspacePath = user.role === "candidate" ? "/candidate/profile" : user.role === "recruiter" ? "/recruiter/workspace" : "/admin/fairs";
  return (
    <AnimatedPage className="page-shell">
      <div className="page-header" data-reveal>
        <span className="eyebrow">Account settings</span>
        <h1>แก้ไขข้อมูลส่วนตัว</h1>
        <p>จัดการข้อมูลบัญชีและรหัสผ่านของ Local membership บน browser เครื่องนี้</p>
      </div>

      <div className="account-settings-grid">
        <PixelSurface className="account-identity-card" data-reveal>
          <ProfileAvatar seed={user.id} size={76} />
          <StatusPill tone="violet">{roleLabels[user.role]}</StatusPill>
          <h2>{user.displayName}</h2>
          <p>{user.email}</p>
          <PixelLink to={workspacePath} tone="neutral"><UserRoundCog aria-hidden="true" /> เปิดข้อมูลตามบทบาท</PixelLink>
        </PixelSurface>

        <PixelSurface data-reveal>
          <h2><Save aria-hidden="true" /> ข้อมูลบัญชี</h2>
          <form className="form-grid" onSubmit={saveAccount}>
            <Field className="full" label="ชื่อที่แสดง" name="displayName" defaultValue={user.displayName} required />
            <Field className="full" label="อีเมล" name="email" type="email" defaultValue={user.email} required />
            <Field className="full" label="บทบาท" name="role" value={roleLabels[user.role]} disabled help="บทบาทถูกกำหนดตอนสร้างบัญชีและแก้เองไม่ได้" />
            {profileMessage ? <p className="form-message" role="status">{profileMessage}</p> : null}
            <div className="button-row"><PixelButton type="submit">บันทึกข้อมูล</PixelButton></div>
          </form>
        </PixelSurface>

        <PixelSurface data-reveal>
          <h2><KeyRound aria-hidden="true" /> เปลี่ยนรหัสผ่าน</h2>
          <form className="form-grid" onSubmit={changePassword}>
            <Field className="full" label="รหัสผ่านปัจจุบัน" name="currentPassword" type="password" autoComplete="current-password" required />
            <Field className="full" label="รหัสผ่านใหม่" name="nextPassword" type="password" autoComplete="new-password" minLength={8} required />
            <Field className="full" label="ยืนยันรหัสผ่านใหม่" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required />
            {passwordMessage ? <p className="form-message" role="status">{passwordMessage}</p> : null}
            <div className="button-row"><PixelButton type="submit" tone="mango">เปลี่ยนรหัสผ่าน</PixelButton></div>
          </form>
        </PixelSurface>
      </div>
    </AnimatedPage>
  );
}
