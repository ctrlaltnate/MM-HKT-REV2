import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AvatarScreen, ImportScreen, LandingScreen, ReviewScreen, VerifyScreen } from './screens/Onboarding'

const WorldScreen = lazy(() => import('./screens/World').then(module => ({ default: module.WorldScreen })))
const NavigatorScreen = lazy(() => import('./screens/World').then(module => ({ default: module.NavigatorScreen })))
const JobScreen = lazy(() => import('./screens/World').then(module => ({ default: module.JobScreen })))
const PreflightScreen = lazy(() => import('./screens/Interview').then(module => ({ default: module.PreflightScreen })))
const InterviewScreen = lazy(() => import('./screens/Interview').then(module => ({ default: module.InterviewScreen })))
const DecisionScreen = lazy(() => import('./screens/Interview').then(module => ({ default: module.DecisionScreen })))
const RevealScreen = lazy(() => import('./screens/Interview').then(module => ({ default: module.RevealScreen })))
const RecruiterDashboard = lazy(() => import('./screens/Recruiter').then(module => ({ default: module.RecruiterDashboard })))
const DemoController = lazy(() => import('./screens/Recruiter').then(module => ({ default: module.DemoController })))

export function App() {
  return (
    <Suspense fallback={<div className="route-loading" role="status">กำลังเปิดเส้นทาง…</div>}><Routes>
      <Route path="/" element={<Navigate to="/event/demo" replace />} />
      <Route path="/event/demo" element={<LandingScreen />} />
      <Route path="/demo/verify" element={<VerifyScreen />} />
      <Route path="/candidate/profile/import" element={<ImportScreen />} />
      <Route path="/candidate/profile/review" element={<ReviewScreen />} />
      <Route path="/candidate/avatar" element={<AvatarScreen />} />
      <Route path="/event/demo/world" element={<WorldScreen />} />
      <Route path="/event/demo/navigator" element={<NavigatorScreen />} />
      <Route path="/event/demo/booths/:boothId/jobs/:jobId" element={<JobScreen />} />
      <Route path="/interviews/:sessionId/preflight" element={<PreflightScreen />} />
      <Route path="/interviews/:sessionId" element={<InterviewScreen />} />
      <Route path="/decisions/:sessionId" element={<DecisionScreen />} />
      <Route path="/matches/:matchId/reveal" element={<RevealScreen />} />
      <Route path="/demo/role/recruiter" element={<Navigate to="/recruiter/demo/dashboard" replace />} />
      <Route path="/recruiter/demo/dashboard" element={<RecruiterDashboard />} />
      <Route path="/demo/control" element={<DemoController />} />
      <Route path="*" element={<Navigate to="/event/demo" replace />} />
    </Routes></Suspense>
  )
}
