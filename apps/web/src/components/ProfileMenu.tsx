import gsap from "gsap";
import {
  Briefcase,
  Building2,
  CalendarDays,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import type { LocalUser } from "../domain/types";
import { ProfileAvatar } from "./ProfileAvatar";
import { StatusPill } from "./PixelUI";

const roleLabels = {
  candidate: "Job Seeker",
  recruiter: "Recruiter",
  admin: "Admin",
};

const roleBadges: Record<LocalUser["role"], { label: string; tone: "cyan" | "violet" | "mango" }> = {
  candidate: { label: "SEEKER", tone: "cyan" },
  recruiter: { label: "RECRUITER", tone: "violet" },
  admin: { label: "ADMIN", tone: "mango" },
};

export function ProfileMenu({
  user,
  onLogout,
  className = "",
}: {
  user: LocalUser;
  onLogout: () => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      gsap.set(menu, { autoAlpha: open ? 1 : 0, y: 0, pointerEvents: open ? "auto" : "none" });
      return;
    }
    if (open) {
      gsap.fromTo(
        menu,
        { autoAlpha: 0, y: -10, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.24, ease: "power3.out", clearProps: "transform" },
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

  return (
    <div ref={rootRef} className={`profile-menu ${open ? "is-open" : ""} ${className}`}>
      <button
        className="profile-trigger"
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <ProfileAvatar seed={user.id} size={34} />
        <span>Profile</span>
        <span className={`profile-role-badge role-badge-${user.role}`}>
          {roleBadges[user.role]?.label || "MEMBER"}
        </span>
        <ChevronDown aria-hidden="true" />
      </button>

      <div ref={menuRef} className="profile-dropdown" role="menu" aria-hidden={!open}>
        {/* User Summary Header */}
        <div className="profile-summary" role="none">
          <ProfileAvatar seed={user.id} size={54} ariaHidden />
          <div role="none">
            <strong>{user.displayName}</strong>
            <span>{user.email}</span>
            <StatusPill tone={roleBadges[user.role]?.tone || "cyan"}>
              {roleLabels[user.role]}
            </StatusPill>
          </div>
        </div>

        {/* Role-Specific Primary Navigation Items */}
        {user.role === "candidate" && (
          <>
            <Link to="/candidate/profile" role="menuitem" onClick={() => setOpen(false)}>
              <UserCheck aria-hidden="true" className="menu-action-icon cyan" />
              <span>
                <strong>ประวัติและโปรไฟล์ทักษะ</strong>
                <small>สายงานเป้าหมาย ประวัติงาน และ AI Resume</small>
              </span>
            </Link>

            <Link to="/" role="menuitem" onClick={() => setOpen(false)}>
              <LayoutDashboard aria-hidden="true" className="menu-action-icon cyan" />
              <span>
                <strong>แดชบอร์ดภาพรวม</strong>
                <small>ความพร้อมโปรไฟล์และงานแฟร์ที่ตรงสาย</small>
              </span>
            </Link>
          </>
        )}

        {user.role === "recruiter" && (
          <>
            <Link to="/recruiter/workspace" role="menuitem" onClick={() => setOpen(false)}>
              <Building2 aria-hidden="true" className="menu-action-icon violet" />
              <span>
                <strong>Recruiter Workspace</strong>
                <small>จัดการบริษัท บูธ ตำแหน่งงาน และผู้สมัคร</small>
              </span>
            </Link>

            <Link to="/" role="menuitem" onClick={() => setOpen(false)}>
              <LayoutDashboard aria-hidden="true" className="menu-action-icon violet" />
              <span>
                <strong>แดชบอร์ดภาพรวม</strong>
                <small>สถิติบดและผู้สมัครในระบบ</small>
              </span>
            </Link>
          </>
        )}

        {user.role === "admin" && (
          <>
            <Link to="/admin/fairs" role="menuitem" onClick={() => setOpen(false)}>
              <ShieldCheck aria-hidden="true" className="menu-action-icon mango" />
              <span>
                <strong>ศูนย์จัดการ Job Fair</strong>
                <small>สร้างงานแฟร์ อนุมัติสมาชิก และรายงาน</small>
              </span>
            </Link>

            <Link to="/" role="menuitem" onClick={() => setOpen(false)}>
              <LayoutDashboard aria-hidden="true" className="menu-action-icon mango" />
              <span>
                <strong>แดชบอร์ดภาพรวม</strong>
                <small>ภาพรวมระบบและสถิติภาพรวม</small>
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
        <button type="button" role="menuitem" className="profile-logout" onClick={onLogout}>
          <LogOut aria-hidden="true" /> ออกจากระบบ
        </button>
      </div>
    </div>
  );
}
