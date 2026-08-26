import gsap from "gsap";
import { ChevronDown, LogOut, Settings } from "lucide-react";
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
        <ChevronDown aria-hidden="true" />
      </button>

      <div ref={menuRef} className="profile-dropdown" role="menu" aria-hidden={!open}>
        <div className="profile-summary">
          <ProfileAvatar seed={user.id} size={54} />
          <div>
            <strong>{user.displayName}</strong>
            <span>{user.email}</span>
            <StatusPill tone="violet">{roleLabels[user.role]}</StatusPill>
          </div>
        </div>
        <Link to="/account" role="menuitem" onClick={() => setOpen(false)}>
          <Settings aria-hidden="true" />
          <span><strong>แก้ไขข้อมูลส่วนตัว</strong><small>ชื่อ อีเมล และรหัสผ่าน</small></span>
        </Link>
        <button type="button" role="menuitem" className="profile-logout" onClick={onLogout}>
          <LogOut aria-hidden="true" /> ออกจากระบบ
        </button>
      </div>
    </div>
  );
}
