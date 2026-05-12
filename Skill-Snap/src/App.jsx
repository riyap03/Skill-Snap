import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Roadmap from './pages/RoadMap';
import Portfolio from './pages/Portfolio';
import Navigation from './components/Navbar';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import Test from './pages/Test';
import { useEffect, useState } from "react";
import axios from "axios";
import PublicPortfolio from "./pages/PublicPortfolio";

function App() {
  const location = useLocation();
  const hideNav = location.pathname === '/login';
  const [showTestPrompt, setShowTestPrompt] = useState(false);

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

 axios
  .get("http://localhost:5000/api/progress/check", {
    headers: { Authorization: `Bearer ${token}` },
  })
  .then((res) => {
    if (!res.data.hasTakenTest) {
      setShowTestPrompt(true);
    }
  })
  .catch(() => {});
}, []);

  return (
    <>
      {!hideNav && <Navigation />}
{showTestPrompt && (
  <div className="test-modal">
    <div className="test-box">
      <h2>Before you start your roadmap…</h2>
      <p>
        SkillSnap needs to understand your level. Take a small test first.
      </p>

      <button onClick={() => window.location.href = "/test"}>
        Take Test
      </button>

      <button onClick={() => setShowTestPrompt(false)}>
        Later
      </button>
    </div>
  </div>
)}

      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Private */}
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />
        <Route path="/roadmap" element={<PrivateRoute><Roadmap /></PrivateRoute>} />
        <Route path="/test" element={<Test />} />
        <Route
  path="/portfolio/:username"
  element={<PublicPortfolio />}
/>

      </Routes>
    </>
  );
}

export default App;
