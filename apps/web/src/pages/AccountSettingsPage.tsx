import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Edit3,
  FileText,
  KeyRound,
  Lock,
  Palette,
  Save,
  ShieldCheck,
  Store,
  UserCheck,
  UserRoundCog,
  X,
} from "lucide-react";
import { type FormEvent, useState } from "react";

import { AnimatedPage } from "../components/AnimatedPage";
import { AvatarCustomizerModal } from "../components/AvatarCustomizerModal";
import { Modal } from "../components/Modal";
import { Field, PixelButton, PixelLink, PixelSurface, StatusPill } from "../components/PixelUI";
import { ProfileAvatar } from "../components/ProfileAvatar";
import { useApp } from "../context/AppContext";

const roleLabels = { candidate: "Job Seeker", recruiter: "Recruiter", admin: "Admin" };

export function AccountSettingsPage() {
  const { user, database, actions } = useApp();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [pendingProfileData, setPendingProfileData] = useState<{ displayName: string; email: string } | null>(null);
  const [showProfileConfirm, setShowProfileConfirm] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Avatar customizer state
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  // Password modal state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [pendingPasswordData, setPendingPasswordData] = useState<{ current: string; next: string } | null>(null);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!user) return null;

  // Role contextual metrics
  const userFairs = database.fairs;
  const userMemberships = database.memberships.filter((m) => m.userId === user.id);
  const userBooths = database.booths.filter((b) => b.ownerId === user.id);
  const userJobs = database.jobs.filter((j) => userBooths.some((b) => b.id === j.boothId));
  const candidateProfile = database.candidateProfiles.find((p) => p.userId === user.id);

  // Profile update submit -> opens confirm
  const handleProfileFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const displayName = String(form.get("displayName")).trim();
    const email = String(form.get("email")).trim();
    if (!displayName || !email) return;
    setPendingProfileData({ displayName, email });
    setShowProfileConfirm(true);
  };

  const confirmSaveProfile = () => {
    if (!pendingProfileData) return;
    try {
      actions.updateUser(user.id, pendingProfileData);
      setProfileMessage({ type: "success", text: "บันทึกข้อมูลบัญชีเรียบร้อยแล้ว" });
      setIsEditingProfile(false);
      setShowProfileConfirm(false);
      setPendingProfileData(null);
    } catch (cause) {
      const msg = cause instanceof Error && cause.message === "EMAIL_EXISTS" ? "อีเมลนี้ถูกใช้งานแล้ว" : "บันทึกไม่สำเร็จ";
      setProfileMessage({ type: "error", text: msg });
      setShowProfileConfirm(false);
    }
  };

  // Password update submit -> opens confirm
  const handlePasswordFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const current = String(form.get("currentPassword"));
    const next = String(form.get("nextPassword"));
    const confirm = String(form.get("confirmPassword"));

    if (next !== confirm) {
      setPasswordMessage({ type: "error", text: "รหัสผ่านใหม่ทั้งสองช่องไม่ตรงกัน" });
      return;
    }
    if (next.length < 8) {
      setPasswordMessage({ type: "error", text: "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร" });
      return;
    }

    setPendingPasswordData({ current, next });
    setShowPasswordConfirm(true);
  };

  const confirmChangePassword = async () => {
    if (!pendingPasswordData) return;
    try {
      await actions.changePassword(user.id, pendingPasswordData.current, pendingPasswordData.next);
      setPasswordMessage({ type: "success", text: "เปลี่ยนรหัสผ่านสำเร็จแล้ว" });
      setShowPasswordConfirm(false);
      setPendingPasswordData(null);
      setTimeout(() => {
        setPasswordModalOpen(false);
        setPasswordMessage(null);
      }, 1400);
    } catch (cause) {
      const code = cause instanceof Error ? cause.message : "";
      const msg =
        code === "INVALID_CREDENTIALS"
          ? "รหัสผ่านปัจจุบันไม่ถูกต้อง"
          : code === "PASSWORD_TOO_SHORT"
          ? "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร"
          : "เปลี่ยนรหัสผ่านไม่สำเร็จ";
      setPasswordMessage({ type: "error", text: msg });
      setShowPasswordConfirm(false);
    }
  };

  const workspacePath =
    user.role === "candidate"
      ? "/candidate/profile"
      : user.role === "recruiter"
      ? "/recruiter/workspace"
      : "/admin/fairs";

  return (
    <AnimatedPage className="page-shell">
      <div className="page-header" data-reveal>
        <span className="eyebrow">Account settings</span>
        <h1>แก้ไขข้อมูลส่วนตัว</h1>
        <p>จัดการข้อมูลบัญชี ความปลอดภัย และพื้นที่ทำงานเฉพาะสำหรับบทบาทของคุณ</p>
      </div>

      <div className="account-settings-grid">
        {/* 1. Profile Summary Card */}
        <PixelSurface className="account-identity-card" data-reveal>
          <div
            style={{ position: "relative", cursor: "pointer" }}
            onClick={() => setAvatarModalOpen(true)}
            title="คลิกเพื่อปรับแต่ง Avatar เสมือนของคุณ"
          >
            <ProfileAvatar seed={user.id} config={user.avatarConfig} size={84} />
            <span
              style={{
                position: "absolute",
                bottom: -8,
                left: "50%",
                transform: "translateX(-50%)",
                background: "var(--surface-2)",
                border: "1px solid var(--cyan)",
                color: "var(--cyan)",
                fontSize: "0.65rem",
                padding: "2px 8px",
                fontFamily: "'Chakra Petch', sans-serif",
                fontWeight: 700,
                whiteSpace: "nowrap",
                borderRadius: 2,
              }}
            >
              ✏️ แต่ง Avatar
            </span>
          </div>
          <StatusPill tone={user.role === "admin" ? "mango" : user.role === "recruiter" ? "violet" : "cyan"}>
            {roleLabels[user.role]}
          </StatusPill>
          <h2>{user.displayName}</h2>
          <p>{user.email}</p>

          <div className="account-quick-actions">
            <PixelButton
              type="button"
              tone="cyan"
              onClick={() => setAvatarModalOpen(true)}
            >
              <Palette aria-hidden="true" /> ปรับแต่ง Avatar
            </PixelButton>

            <PixelButton
              type="button"
              tone="mango"
              onClick={() => {
                setPasswordMessage(null);
                setPasswordModalOpen(true);
              }}
            >
              <KeyRound aria-hidden="true" /> เปลี่ยนรหัสผ่าน
            </PixelButton>

            <PixelLink to={workspacePath} tone="neutral">
              <UserRoundCog aria-hidden="true" /> เปิดพื้นที่ทำงาน
            </PixelLink>
          </div>
        </PixelSurface>

        {/* 2. Account Details & Inline Edit Card */}
        <PixelSurface data-reveal>
          <div className="account-card-header">
            <div>
              <span className="eyebrow">Account Information</span>
              <h2>ข้อมูลบัญชี</h2>
            </div>
            {!isEditingProfile ? (
              <button
                type="button"
                className="edit-pencil-btn"
                onClick={() => {
                  setProfileMessage(null);
                  setIsEditingProfile(true);
                }}
                title="กดเพื่อแก้ไขชื่อหรืออีเมล"
              >
                <Edit3 aria-hidden="true" />
                <span>แก้ไข</span>
              </button>
            ) : (
              <button
                type="button"
                className="edit-pencil-btn cancel"
                onClick={() => {
                  setProfileMessage(null);
                  setIsEditingProfile(false);
                }}
                title="ยกเลิกการแก้ไข"
              >
                <X aria-hidden="true" />
                <span>ยกเลิก</span>
              </button>
            )}
          </div>

          {profileMessage ? (
            <p className={`form-message ${profileMessage.type === "error" ? "error" : ""}`} role="status">
              {profileMessage.text}
            </p>
          ) : null}

          {!isEditingProfile ? (
            <div className="account-view-details">
              <div className="detail-item">
                <span className="detail-label">ชื่อที่แสดง:</span>
                <strong>{user.displayName}</strong>
              </div>
              <div className="detail-item">
                <span className="detail-label">อีเมล:</span>
                <strong>{user.email}</strong>
              </div>
              <div className="detail-item">
                <span className="detail-label">บทบาทบัญชี:</span>
                <div className="detail-value-role">
                  <StatusPill tone={user.role === "admin" ? "mango" : user.role === "recruiter" ? "violet" : "cyan"}>
                    {roleLabels[user.role]}
                  </StatusPill>
                  <small>บทบาทถูกกำหนดตอนสร้างบัญชี</small>
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-label">สถานะความปลอดภัย:</span>
                <span className="security-status-tag">
                  <ShieldCheck aria-hidden="true" /> PBKDF2 Password Protection
                </span>
              </div>
            </div>
          ) : (
            <form className="form-grid" onSubmit={handleProfileFormSubmit}>
              <Field className="full" label="ชื่อที่แสดง" name="displayName" defaultValue={user.displayName} required />
              <Field className="full" label="อีเมล" name="email" type="email" defaultValue={user.email} required />
              <Field
                className="full"
                label="บทบาท"
                name="role"
                value={roleLabels[user.role]}
                disabled
                help="บทบาทถูกกำหนดตอนสร้างบัญชีและแก้ไขเองไม่ได้"
              />
              <div className="button-row">
                <PixelButton type="button" tone="neutral" onClick={() => setIsEditingProfile(false)}>
                  ยกเลิก
                </PixelButton>
                <PixelButton type="submit" tone="cyan">
                  <Save aria-hidden="true" /> บันทึกข้อมูล
                </PixelButton>
              </div>
            </form>
          )}
        </PixelSurface>

        {/* 3. Role-Specific Context & Operations Hub */}
        <PixelSurface data-reveal className="role-context-hub">
          {user.role === "candidate" ? (
            <div className="role-hub-content">
              <div className="hub-header">
                <span className="eyebrow"><FileText aria-hidden="true" /> Candidate Workspace</span>
                <h2>ประวัติและทักษะ</h2>
              </div>
              <p className="hub-desc">
                จัดการโปรไฟล์ทักษะที่ได้จากการสกัด Resume PDF ด้วยระบบ AI และกำหนดสิทธิ์การเปิดเผยข้อมูลแบบ Masked
              </p>

              <div className="hub-metrics-grid">
                <div className="metric-box">
                  <span className="metric-num">
                    {candidateProfile?.resume?.analysis?.skills?.length ?? candidateProfile?.manualSkills?.length ?? 0}
                  </span>
                  <span className="metric-label">ทักษะที่บันทึก</span>
                </div>
                <div className="metric-box">
                  <span className="metric-num">{userMemberships.length}</span>
                  <span className="metric-label">แฟร์ที่เข้าร่วม</span>
                </div>
              </div>

              <div className="hub-footer">
                <PixelLink to="/candidate/profile" tone="mango">
                  <UserCheck aria-hidden="true" /> ไปยังโปรไฟล์ผู้สมัคร
                </PixelLink>
              </div>
            </div>
          ) : user.role === "recruiter" ? (
            <div className="role-hub-content">
              <div className="hub-header">
                <span className="eyebrow"><Store aria-hidden="true" /> Recruiter Hub</span>
                <h2>บูธและตำแหน่งงาน</h2>
              </div>
              <p className="hub-desc">
                จัดการบูธบริษัทในงานแฟร์ ประกาศรับสมัครงาน และคัดกรอง Candidate Board จากหลักฐานทักษะ
              </p>

              <div className="hub-metrics-grid">
                <div className="metric-box">
                  <span className="metric-num">{userBooths.length}</span>
                  <span className="metric-label">บูธที่เปิดอยู่</span>
                </div>
                <div className="metric-box">
                  <span className="metric-num">{userJobs.length}</span>
                  <span className="metric-label">ตำแหน่งงาน</span>
                </div>
                <div className="metric-box">
                  <span className="metric-num">{userMemberships.length}</span>
                  <span className="metric-label">แฟร์ที่เข้าร่วม</span>
                </div>
              </div>

              <div className="hub-footer">
                <PixelLink to="/recruiter/workspace" tone="violet">
                  <Building2 aria-hidden="true" /> ไปยังพื้นที่ Recruiter
                </PixelLink>
              </div>
            </div>
          ) : (
            <div className="role-hub-content">
              <div className="hub-header">
                <span className="eyebrow"><CalendarDays aria-hidden="true" /> Admin Operations</span>
                <h2>ศูนย์บริหาร Job Fair</h2>
              </div>
              <p className="hub-desc">
                ควบคุมวงจรงานแฟร์ตั้งแต่การสร้าง, เปิด-ปิดงานตามกำหนดเวลา และอนุมัติสิทธิ์การเข้าร่วมของ Recruiter
              </p>

              <div className="hub-metrics-grid">
                <div className="metric-box">
                  <span className="metric-num">{userFairs.length}</span>
                  <span className="metric-label">งานแฟร์ทั้งหมด</span>
                </div>
                <div className="metric-box">
                  <span className="metric-num">
                    {database.memberships.filter((m) => m.status === "PENDING_APPROVAL").length}
                  </span>
                  <span className="metric-label">คำขอรออนุมัติ</span>
                </div>
              </div>

              <div className="hub-footer">
                <PixelLink to="/admin/fairs" tone="mango">
                  <CalendarDays aria-hidden="true" /> ไปยังแดชบอร์ด Admin
                </PixelLink>
              </div>
            </div>
          )}
        </PixelSurface>
      </div>

      {/* Profile Edit Confirmation Modal */}
      <Modal
        open={showProfileConfirm}
        onClose={() => setShowProfileConfirm(false)}
        title="ยืนยันการแก้ไขข้อมูลบัญชี"
        subtitle="กรุณาตรวจสอบข้อมูลก่อนบันทึก"
        maxWidth="500px"
      >
        <div className="confirm-modal-content">
          <p>คุณต้องการบันทึกการเปลี่ยนแปลงข้อมูลบัญชีนี้หรือไม่?</p>
          {pendingProfileData && (
            <div className="confirm-data-summary">
              <div><strong>ชื่อที่แสดง:</strong> {pendingProfileData.displayName}</div>
              <div><strong>อีเมล:</strong> {pendingProfileData.email}</div>
            </div>
          )}
          <div className="confirm-actions">
            <PixelButton type="button" tone="neutral" onClick={() => setShowProfileConfirm(false)}>
              ยกเลิก
            </PixelButton>
            <PixelButton type="button" tone="cyan" onClick={confirmSaveProfile}>
              <CheckCircle2 aria-hidden="true" /> ยืนยันบันทึก
            </PixelButton>
          </div>
        </div>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        open={passwordModalOpen}
        onClose={() => {
          setPasswordModalOpen(false);
          setShowPasswordConfirm(false);
        }}
        title="เปลี่ยนรหัสผ่านบัญชี"
        subtitle="เพื่อความปลอดภัย กรุณาระบุรหัสผ่านปัจจุบันและรหัสผ่านใหม่ที่มีอย่างน้อย 8 ตัวอักษร"
        maxWidth="540px"
      >
        <div className="password-modal-content">
          {passwordMessage ? (
            <p className={`form-message ${passwordMessage.type === "error" ? "error" : ""}`} role="status">
              {passwordMessage.text}
            </p>
          ) : null}

          {!showPasswordConfirm ? (
            <form className="form-grid" onSubmit={handlePasswordFormSubmit}>
              <Field
                className="full"
                label="รหัสผ่านปัจจุบัน"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
              />
              <Field
                className="full"
                label="รหัสผ่านใหม่"
                name="nextPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                help="ความยาวอย่างน้อย 8 ตัวอักษร"
                required
              />
              <Field
                className="full"
                label="ยืนยันรหัสผ่านใหม่"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
              <div className="button-row">
                <PixelButton type="button" tone="neutral" onClick={() => setPasswordModalOpen(false)}>
                  ยกเลิก
                </PixelButton>
                <PixelButton type="submit" tone="mango">
                  <Lock aria-hidden="true" /> ดำเนินการเปลี่ยนรหัสผ่าน
                </PixelButton>
              </div>
            </form>
          ) : (
            <div className="confirm-modal-content">
              <p>คุณแน่ใจหรือไม่ว่าต้องการเปลี่ยนรหัสผ่านสำหรับบัญชีนี้?</p>
              <div className="confirm-actions">
                <PixelButton type="button" tone="neutral" onClick={() => setShowPasswordConfirm(false)}>
                  กลับไปแก้ไข
                </PixelButton>
                <PixelButton type="button" tone="mango" onClick={confirmChangePassword}>
                  <CheckCircle2 aria-hidden="true" /> ยืนยันเปลี่ยนรหัสผ่าน
                </PixelButton>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal: Avatar Customizer */}
      <AvatarCustomizerModal
        open={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
      />
    </AnimatedPage>
  );
}
