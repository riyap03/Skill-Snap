// import { Routes, Route, useLocation } from 'react-router-dom';
// import Home from './pages/Home';
// import Roadmap from './pages/RoadMap';
// import Portfolio from './pages/Portfolio';
// import Navigation from './components/Navbar';
// import Login from './pages/Login';
// import PrivateRoute from './components/PrivateRoute';
// import Test from './pages/Test';
// import { useEffect, useState } from "react";
// import axios from "axios";
// import PublicPortfolio from "./pages/PublicPortfolio";
// import { apiUrl } from "./config/api";

// function App() {
//   const location = useLocation();
//   const hideNav = location.pathname === '/login';
//   const [showTestPrompt, setShowTestPrompt] = useState(false);

// useEffect(() => {
//   const token = localStorage.getItem("token");
//   if (!token) return;

//  axios
//   .get(apiUrl("/api/progress/check"), {
//     headers: { Authorization: `Bearer ${token}` },
//   })
//   .then((res) => {
//     if (!res.data.hasTakenTest) {
//       setShowTestPrompt(true);
//     }
//   })
//   .catch(() => {});
// }, []);

//   return (
//     <>
//       {!hideNav && <Navigation />}
// {location.pathname === "/roadmap" && showTestPrompt && (
//   <div className="test-modal">
//     <div className="test-box">
//       <h2>Before you start your roadmap…</h2>
//       <p>
//         SkillSnap needs to understand your level. Take a small test first.
//       </p>

//       <button onClick={() => window.location.href = "/test"}>
//         Take Test
//       </button>

//       <button onClick={() => setShowTestPrompt(false)}>
//         Later
//       </button>
//     </div>
//   </div>
// )}

//       <Routes>
//         {/* Public */}
//         <Route path="/login" element={<Login />} />

//         {/* Private */}
//         <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
//         <Route path="/portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />
//         <Route path="/roadmap" element={<PrivateRoute><Roadmap /></PrivateRoute>} />
//         <Route path="/test" element={<Test />} />
//         <Route
//   path="/portfolio/:username"
//   element={<PublicPortfolio />}
// />

//       </Routes>
//     </>
//   );
// }

// export default App;
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Roadmap from './pages/RoadMap';
import Portfolio from './pages/Portfolio';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import Test from './pages/Test';
import PublicPortfolio from "./pages/PublicPortfolio";
import Dashboard from './pages/Dashboard';
import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "./config/api";
import { Link } from "react-router-dom";
import { Sparkles, X } from "lucide-react";

function App() {
  const location = useLocation();
  const hideNav = location.pathname === '/login';
  const [showTestPrompt, setShowTestPrompt] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(apiUrl("/api/progress/check"), {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (!res.data.hasTakenTest) setShowTestPrompt(true);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {!hideNav && <Navbar />}

      {/* STYLED TEST PROMPT MODAL */}
      {location.pathname === "/roadmap" && showTestPrompt && (
        <div className="fixed inset-0 z-50 grid place-items-center p-6 bg-background/70 backdrop-blur-sm">
          <div className="card-glow rounded-3xl max-w-md w-full p-8 relative overflow-hidden">
            <button
              onClick={() => setShowTestPrompt(false)}
              className="absolute top-4 right-4 h-8 w-8 grid place-items-center rounded-full hover:bg-surface-elevated"
            >
              <X className="h-4 w-4" />
            </button>
            <div
              className="absolute -top-20 -right-20 h-60 w-60 rounded-full opacity-30"
              style={{ background: "var(--gradient-brand)", filter: "blur(80px)" }}
            />
            <div className="relative text-center">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-brand grid place-items-center shadow-[0_0_30px_-4px_var(--brand-purple)]">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">Take the skill assessment first</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                SkillSnap needs to understand your level before personalizing your roadmap.
              </p>
              <div className="mt-6 flex gap-2 justify-center">
                <button
                  onClick={() => setShowTestPrompt(false)}
                  className="px-4 py-2 rounded-md border border-border text-sm hover:bg-surface-elevated"
                >
                  Maybe later
                </button>
                <Link
                  to="/test"
                  onClick={() => setShowTestPrompt(false)}
                  className="px-4 py-2 rounded-md bg-gradient-brand text-primary-foreground text-sm font-medium"
                >
                  Start assessment
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/portfolio/:username" element={<PublicPortfolio />} />
        <Route path="/test" element={<Test />} />

        {/* Private */}
      
<Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
<Route path="/roadmap"   element={<PrivateRoute><Roadmap /></PrivateRoute>} />
<Route path="/portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />
<Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
       

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;