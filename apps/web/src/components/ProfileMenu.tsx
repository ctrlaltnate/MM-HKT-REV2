import {
  Building2,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Palette,
  Settings,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import type { LocalUser, UserRole } from "../domain/types";
import { AvatarCustomizerModal } from "./AvatarCustomizerModal";
import { StatusPill } from "./PixelUI";
import { ProfileAvatar } from "./ProfileAvatar";

const roleLabels: Record<UserRole, string> = {
  candidate: "ผู้สมัครงาน (Job Seeker)",
  recruiter: "Recruiter / บริษัท",
  admin: "ผู้ดูแลระบบ (Admin)",
};

const roleBadges: Record<UserRole, { label: string; tone: "cyan" | "violet" | "mango" }> = {
  candidate: { label: "SEEKER", tone: "cyan" },
  recruiter: { label: "RECRUITER", tone: "violet" },
  admin: { label: "ADMIN", tone: "mango" },
};

export function ProfileMenu({
  user: propUser,
  onLogout: propOnLogout,
  className = "",
}: {
  user?: LocalUser;
  onLogout?: () => void;
  className?: string;
}) {
  const { user: contextUser, actions } = useApp();
  const user = propUser || contextUser;
  const { toast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setOpen(false);
    if (propOnLogout) {
      propOnLogout();
    } else {
      await actions.logout();
      toast.info("ออกจากระบบเรียบร้อยแล้ว");
      navigate("/");
    }
  };

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    if (open) {
      gsap.fromTo(
        menu,
        { autoAlpha: 0, y: -8, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.18, ease: "power2.out", pointerEvents: "auto" },
      );
    } else {
      gsap.set(menu, { autoAlpha: 0, y: -8, pointerEvents: "none" });
    }
  }, [open]);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, []);

  if (!user) return null;

  return (
    <>
      <div ref={rootRef} className={`profile-menu ${open ? "is-open" : ""} ${className}`}>
        <button
          className="profile-trigger"
          type="button"
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((value) => !value)}
        >
          <ProfileAvatar seed={user.id} config={user.avatarConfig} size={34} />
          <span>Profile</span>
          <span className={`profile-role-badge role-badge-${user.role}`}>
            {roleBadges[user.role]?.label || "MEMBER"}
          </span>
          <ChevronDown aria-hidden="true" />
        </button>

        <div ref={menuRef} className="profile-dropdown" role="menu" aria-hidden={!open}>
          {/* User Summary Header */}
          <div className="profile-summary" role="none">
            <ProfileAvatar seed={user.id} config={user.avatarConfig} size={54} ariaHidden />
            <div role="none">
              <strong>{user.displayName}</strong>
              <span>{user.email}</span>
              <StatusPill tone={roleBadges[user.role]?.tone || "cyan"}>
                {roleLabels[user.role]}
              </StatusPill>
            </div>
          </div>

          {/* Customize Avatar Button (Available for all roles) */}
          <button
            type="button"
            role="menuitem"
            className="profile-custom-avatar-btn"
            onClick={() => {
              setOpen(false);
              setAvatarModalOpen(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              padding: "10px 14px",
              background: "rgba(120, 219, 230, 0.08)",
              border: "1px solid rgba(120, 219, 230, 0.25)",
              color: "var(--text)",
              cursor: "pointer",
              textAlign: "left",
              margin: "6px 0",
              borderRadius: 2,
            }}
          >
            <Palette aria-hidden="true" style={{ width: 18, height: 18, color: "var(--cyan)", flexShrink: 0 }} />
            <span>
              <strong style={{ color: "var(--cyan)", display: "block", fontSize: "0.88rem" }}>
                ปรับแต่ง Avatar เสมือน
              </strong>
              <small style={{ color: "var(--muted)", display: "block", fontSize: "0.75rem" }}>
                สีผิว ทรงผม ตา หน้า ของตกแต่ง
              </small>
            </span>
          </button>

          {/* Role-Specific Primary Navigation Items */}
          {user.role === "candidate" && (
            <>
              <Link to="/" role="menuitem" onClick={() => setOpen(false)}>
                <LayoutDashboard aria-hidden="true" className="menu-action-icon cyan" />
                <span>
                  <strong>แดชบอร์ดภาพรวม</strong>
                  <small>ความพร้อมโปรไฟล์และงานแฟร์ที่ตรงสาย</small>
                </span>
              </Link>

              <Link to="/candidate/profile" role="menuitem" onClick={() => setOpen(false)}>
                <UserCheck aria-hidden="true" className="menu-action-icon cyan" />
                <span>
                  <strong>ประวัติและโปรไฟล์ทักษะ</strong>
                  <small>สายงานเป้าหมาย ประวัติงาน และ AI Resume</small>
                </span>
              </Link>
            </>
          )}

          {user.role === "recruiter" && (
            <>
              <Link to="/" role="menuitem" onClick={() => setOpen(false)}>
                <LayoutDashboard aria-hidden="true" className="menu-action-icon violet" />
                <span>
                  <strong>แดชบอร์ดภาพรวม</strong>
                  <small>สถิติบดและผู้สมัครในระบบ</small>
                </span>
              </Link>

              <Link to="/recruiter/workspace" role="menuitem" onClick={() => setOpen(false)}>
                <Building2 aria-hidden="true" className="menu-action-icon violet" />
                <span>
                  <strong>Recruiter Workspace</strong>
                  <small>จัดการบริษัท บูธ ตำแหน่งงาน และผู้สมัคร</small>
                </span>
              </Link>
            </>
          )}

          {user.role === "admin" && (
            <>
              <Link to="/" role="menuitem" onClick={() => setOpen(false)}>
                <LayoutDashboard aria-hidden="true" className="menu-action-icon mango" />
                <span>
                  <strong>แดชบอร์ดภาพรวม</strong>
                  <small>ภาพรวมระบบและสถิติภาพรวม</small>
                </span>
              </Link>

              <Link to="/admin/fairs" role="menuitem" onClick={() => setOpen(false)}>
                <ShieldCheck aria-hidden="true" className="menu-action-icon mango" />
                <span>
                  <strong>ศูนย์จัดการ Job Fair</strong>
                  <small>สร้างงานแฟร์ อนุมัติสมาชิก และรายงาน</small>
                </span>
              </Link>
            </>
          )}

          {/* Global Account Settings */}
          <Link to="/account" role="menuitem" onClick={() => setOpen(false)}>
            <Settings aria-hidden="true" className="menu-action-icon muted" />
            <span>
              <strong>ตั้งค่าบัญชีผู้ใช้</strong>
              <small>ชื่อ อีเมล และรหัสผ่าน</small>
            </span>
          </Link>

          {/* Logout Button */}
          <button type="button" role="menuitem" className="profile-logout" onClick={handleLogout}>
            <LogOut aria-hidden="true" /> ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Avatar Customizer Modal */}
      <AvatarCustomizerModal
        open={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
      />
    </>
  );
}
