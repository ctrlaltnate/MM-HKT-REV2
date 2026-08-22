import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DigitalIdVerifyPage } from './pages/DigitalIdVerifyPage';
import { ResumeImportPage } from './pages/ResumeImportPage';
import { MaskedProfileReviewPage } from './pages/MaskedProfileReviewPage';
import { CharacterStudioPage } from './pages/CharacterStudioPage';
import { CareerHallWorldPage } from './pages/CareerHallWorldPage';
import { NavigatorListPage } from './pages/NavigatorListPage';
import { InterviewPreflightPage } from './pages/InterviewPreflightPage';
import { SpeedInterviewPage } from './pages/SpeedInterviewPage';
import { PrivateDecisionPage } from './pages/PrivateDecisionPage';
import { ResultSummaryPage } from './pages/ResultSummaryPage';
import { RevealConsentPage } from './pages/RevealConsentPage';
import { RecruiterDashboardPage } from './pages/RecruiterDashboardPage';
import { AdminOperationsPage } from './pages/AdminOperationsPage';
import { DemoControllerPage } from './pages/DemoControllerPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing & Multi-Role Entry */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/events/:id" element={<LandingPage />} />
        <Route path="/event/demo" element={<LandingPage />} />

        {/* Candidate Flow (SC-02 to SC-05) */}
        <Route path="/app/onboarding/verify" element={<DigitalIdVerifyPage />} />
        <Route path="/candidate/profile/import" element={<ResumeImportPage />} />
        <Route path="/candidate/profile/review" element={<MaskedProfileReviewPage />} />
        <Route path="/candidate/avatar" element={<CharacterStudioPage />} />

        {/* Career Hall World & Navigator (SC-06 to SC-08) */}
        <Route path="/app/events/:id/world" element={<CareerHallWorldPage />} />
        <Route path="/app/events/:id/navigator" element={<NavigatorListPage />} />

        {/* Speed Interview Flow (SC-10 to SC-14) */}
        <Route path="/app/interviews/:id/preflight" element={<InterviewPreflightPage />} />
        <Route path="/app/interviews/:id" element={<SpeedInterviewPage />} />
        <Route path="/app/interviews/:id/decision" element={<PrivateDecisionPage />} />
        <Route path="/app/matches/:id/result" element={<ResultSummaryPage />} />
        <Route path="/matches/:id/reveal" element={<RevealConsentPage />} />

        {/* Recruiter & Admin Operations (SC-15 to SC-17) */}
        <Route path="/recruiter/demo/dashboard" element={<RecruiterDashboardPage />} />
        <Route path="/ops/events/:id/live" element={<AdminOperationsPage />} />
        <Route path="/demo/control" element={<DemoControllerPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
