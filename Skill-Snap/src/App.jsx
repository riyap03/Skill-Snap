import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Roadmap from "./pages/RoadMap";
import Portfolio from "./pages/Portfolio";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Test from "./pages/Test";
import PublicPortfolio from "./pages/PublicPortfolio";
import Dashboard from "./pages/Dashboard";
import OnboardingWizard from "./components/OnboardingWizard";
import AssessmentPage from "./pages/AssessmentPage";
import AssessmentResult from "./pages/AssessmentResult";
import CareerCoach from "./pages/CareerCoach";
import JobReadiness from "./pages/JobReadiness";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import ProjectsPage from "./components/ProjectsPage";
import SkillTest from "./pages/SkillTest";

function App() {
  const location = useLocation();
  const hideNav = location.pathname === "/login";

  return (
    <>
      {!hideNav && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/portfolio/:username" element={<PublicPortfolio />} />
        <Route path="/test" element={<Test />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/assessment/:track" element={<AssessmentPage />} />
        <Route path="/assessment/result" element={<AssessmentResult />} />
        <Route path="/coach" element={<CareerCoach />} />
        <Route path="/onboarding" element={<OnboardingWizard />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/readiness" element={<JobReadiness />} />
          <Route path="/skill-test" element={<SkillTest />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;
