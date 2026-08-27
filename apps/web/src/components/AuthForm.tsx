import { LogIn, UserPlus } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";

import { useApp } from "../context/AppContext";
import type { AuthMode } from "../context/AuthModalContext";
import type { UserRole } from "../domain/types";
import { Field, PixelButton, SelectField } from "./PixelUI";

const authMessages: Record<string, string> = {
  EMAIL_EXISTS: "อีเมลนี้มีบัญชีอยู่แล้ว",
  PASSWORD_TOO_SHORT: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
  INVALID_CREDENTIALS: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
};

export function AuthForm({
  initialMode = "login",
  onComplete,
}: {
  initialMode?: AuthMode;
  onComplete: () => void;
}) {
  const { actions } = useApp();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setError("");
  }, [initialMode]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      if (mode === "login") {
        await actions.login(String(form.get("email")), String(form.get("password")));
      } else {
        await actions.register({
          email: String(form.get("email")),
          displayName: String(form.get("displayName")),
          password: String(form.get("password")),
          role: String(form.get("role")) as UserRole,
        });
      }
      onComplete();
    } catch (cause) {
      const code = cause instanceof Error ? cause.message : "UNKNOWN";
      setError(authMessages[code] ?? "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-tabs" role="tablist" aria-label="เลือกวิธีเข้าสู่ระบบ">
        <button className={mode === "login" ? "auth-tab active" : "auth-tab"} type="button" role="tab" aria-selected={mode === "login"} onClick={() => setMode("login")}>เข้าสู่ระบบ</button>
        <button className={mode === "register" ? "auth-tab active" : "auth-tab"} type="button" role="tab" aria-selected={mode === "register"} onClick={() => setMode("register")}>สร้างบัญชี</button>
      </div>

      <form key={mode} className="form-grid" onSubmit={submit} autoComplete="off">
        {mode === "register" ? (
          <>
            <Field className="full" label="ชื่อที่ใช้ในระบบ" name="displayName" autoComplete="off" required />
            <SelectField className="full" label="บทบาทเริ่มต้น" name="role" defaultValue="candidate" required>
              <option value="candidate">ผู้สมัครงาน</option>
              <option value="recruiter">Recruiter / บริษัท</option>
              <option value="admin">ผู้ดูแลและสร้าง Job Fair</option>
            </SelectField>
          </>
        ) : null}
        <Field
          className="full"
          label="อีเมล"
          name="email"
          type="email"
          autoComplete={mode === "login" ? "email" : "off"}
          required
        />
        <Field
          className="full"
          label="รหัสผ่าน"
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
        />
        {error ? <p className="form-message error" role="alert">{error}</p> : null}
        <div className="button-row">
          <PixelButton type="submit" tone="mango" disabled={loading}>
            {mode === "login" ? <LogIn aria-hidden="true" /> : <UserPlus aria-hidden="true" />}
            {loading ? "กำลังตรวจสอบ..." : mode === "login" ? "เข้าสู่ระบบ" : "สร้างบัญชี"}
          </PixelButton>
        </div>
      </form>
    </>
  );
}
