import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useApp } from "../context/AppContext";
import type { UserRole } from "../domain/types";

export function ProtectedRoute({
  children,
  role,
}: PropsWithChildren<{ role?: UserRole }>) {
  const { user } = useApp();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/app" replace />;
  }

  return children;
}
