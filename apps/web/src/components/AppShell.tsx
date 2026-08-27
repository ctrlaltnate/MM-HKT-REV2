import {
  Building2,
  CalendarDays,
  Home,
  LayoutDashboard,
  LogIn,
  Menu,
  ShieldCheck,
  UserCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { useApp } from "../context/AppContext";
import { AuthModalContext, type AuthMode } from "../context/AuthModalContext";
import { useGlobalGsapInteractions } from "../hooks/useGlobalGsapInteractions";
import { AuthModal } from "./AuthModal";
import { ProfileMenu } from "./ProfileMenu";
import { ToastContainer } from "./ToastContainer";

export function AppShell() {
  useGlobalGsapInteractions();
  const { user, actions } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const navigate = useNavigate();

  const openAuthModal = (mode: AuthMode = "login") => {
    setAuthMode(mode);
    setAuthOpen(true);
    setMenuOpen(false);
  };

  const logout = () => {
    setMenuOpen(false);
    actions.logout();
    window.location.href = "/";
  };

  const finishAuth = () => {
    setAuthOpen(false);
    navigate("/");
  };

  return (
    <AuthModalContext.Provider value={{ openAuthModal }}>
      <div className="app-root">
        <header className="site-header">
          <Link className="brand" to="/" aria-label="MaskedMatch หน้าแรก">
            <img className="brand-logo" src="/assets/brand/maskedmatch-logo.png" alt="" aria-hidden="true" />
            <span>
              <strong>MASKEDMATCH</strong>
              <small>SKILLS FIRST</small>
            </span>
          </Link>

          <button
            className="mobile-menu-button"
            aria-label={menuOpen ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>

          <nav className={menuOpen ? "site-nav is-open" : "site-nav"} aria-label="เมนูหลัก">
            {/* Global Home */}
            <NavLink to="/" end onClick={() => setMenuOpen(false)}>
              <Home aria-hidden="true" /> {user ? "แดชบอร์ด" : "หน้าแรก"}
            </NavLink>

            {/* Candidate Nav */}
            {user?.role === "candidate" && (
              <NavLink to="/candidate/profile" onClick={() => setMenuOpen(false)}>
                <UserCheck aria-hidden="true" /> โปรไฟล์ทักษะ
              </NavLink>
            )}

            {/* Recruiter Nav */}
            {user?.role === "recruiter" && (
              <NavLink to="/recruiter/workspace" onClick={() => setMenuOpen(false)}>
                <Building2 aria-hidden="true" /> Recruiter Studio
              </NavLink>
            )}

            {/* Admin Nav */}
            {user?.role === "admin" && (
              <NavLink to="/admin/fairs" onClick={() => setMenuOpen(false)}>
                <ShieldCheck aria-hidden="true" /> จัดการงานแฟร์
              </NavLink>
            )}

            {/* Fairs for everyone */}
            <NavLink to="/fairs" onClick={() => setMenuOpen(false)}>
              <CalendarDays aria-hidden="true" /> จ็อบแฟร์
            </NavLink>

            {user ? (
              <ProfileMenu className="profile-menu-mobile" user={user} onLogout={logout} />
            ) : (
              <button className="mobile-nav-account" type="button" onClick={() => openAuthModal("login")}>
                <LogIn aria-hidden="true" /> เข้าสู่ระบบ
              </button>
            )}
          </nav>

          <div className="header-account">
            {user ? (
              <ProfileMenu user={user} onLogout={logout} />
            ) : (
              <button className="header-login" type="button" onClick={() => openAuthModal("login")}>
                <LogIn aria-hidden="true" /> เข้าสู่ระบบ
              </button>
            )}
          </div>
        </header>

        <main id="main-content">
          <Outlet />
        </main>

        <footer className="site-footer">
          <div>
            <img className="brand-logo small" src="/assets/brand/maskedmatch-logo.png" alt="" aria-hidden="true" />
            <p>พื้นที่งานแฟร์อาชีพออนไลน์ที่เริ่มจากทักษะและหลักฐาน</p>
          </div>
          <div className="footer-status">
            <span aria-hidden="true" className="footer-online-dot" />
            <span>Local membership พร้อมใช้งาน</span>
          </div>
        </footer>
      </div>

      <AuthModal
        open={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
        onComplete={finishAuth}
      />

      <ToastContainer />
    </AuthModalContext.Provider>
  );
}
