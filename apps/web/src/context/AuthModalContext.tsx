import { createContext, useContext } from "react";

export type AuthMode = "login" | "register";

interface AuthModalContextValue {
  openAuthModal: (mode?: AuthMode) => void;
}

export const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function useAuthModal(): AuthModalContextValue {
  const value = useContext(AuthModalContext);
  if (!value) throw new Error("useAuthModal must be used inside AuthModalContext.Provider");
  return value;
}
