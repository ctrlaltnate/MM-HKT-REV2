import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "./components/AppShell";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RecruiterDemoPage } from "./pages/RecruiterDemoPage";

const AdminFairsPage = lazy(() => import("./pages/AdminFairsPage").then((module) => ({ default: module.AdminFairsPage })));
const AdminOperationsPage = lazy(() => import("./pages/AdminOperationsPage").then((module) => ({ default: module.AdminOperationsPage })));
const AccountSettingsPage = lazy(() => import("./pages/AccountSettingsPage").then((module) => ({ default: module.AccountSettingsPage })));
const AuthPage = lazy(() => import("./pages/AuthPage").then((module) => ({ default: module.AuthPage })));
const CandidateProfilePage = lazy(() => import("./pages/CandidateProfilePage").then((module) => ({ default: module.CandidateProfilePage })));
const DashboardPage = lazy(() => import("./pages/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const FairDetailPage = lazy(() => import("./pages/FairDetailPage").then((module) => ({ default: module.FairDetailPage })));
const FairsPage = lazy(() => import("./pages/FairsPage").then((module) => ({ default: module.FairsPage })));
const LandingPage = lazy(() => import("./pages/LandingPage").then((module) => ({ default: module.LandingPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })));
const RecruiterWorkspacePage = lazy(() => import("./pages/RecruiterWorkspacePage").then((module) => ({ default: module.RecruiterWorkspacePage })));
const GameHallDemoPage = lazy(() => import("./pages/GameHallDemoPage").then((module) => ({ default: module.GameHallDemoPage })));

function RouteLoading() {
  return <div className="route-loading" role="status">กำลังเปิดพื้นที่ทำงาน…</div>;
}

export function App() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/recruiter" replace />} />
        <Route path="r" element={<Navigate to="/recruiter" replace />} />
        <Route path="recruiter" element={<RecruiterDemoPage />} />
        <Route path="demo/hall" element={<GameHallDemoPage />} />
        <Route element={<AppShell />}>
          <Route path="landing" element={<LandingPage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="fairs" element={<FairsPage />} />
          <Route path="fairs/:fairId" element={<FairDetailPage />} />
          <Route path="app" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="account" element={<ProtectedRoute><AccountSettingsPage /></ProtectedRoute>} />
          <Route path="candidate/profile" element={<ProtectedRoute role="candidate"><CandidateProfilePage /></ProtectedRoute>} />
          <Route path="recruiter/workspace" element={<ProtectedRoute role="recruiter"><RecruiterWorkspacePage /></ProtectedRoute>} />
          <Route path="admin/fairs" element={<ProtectedRoute role="admin"><AdminFairsPage /></ProtectedRoute>} />
          <Route path="ops/events/:eventId/live" element={<ProtectedRoute role="admin"><AdminOperationsPage /></ProtectedRoute>} />
          <Route path="home" element={<Navigate to="/recruiter" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
