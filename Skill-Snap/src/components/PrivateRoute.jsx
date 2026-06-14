import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../config/api";

export default function PrivateRoute() {
  const token = localStorage.getItem("token");
  const [checking, setChecking] = useState(true);
  const [needsTest, setNeedsTest] = useState(false);

  useEffect(() => {
    if (!token) {
      setChecking(false);
      return;
    }

    const checkTestStatus = async () => {
      try {
        const res = await axios.get(apiUrl("/api/assessment/skill-test"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNeedsTest(!res.data.alreadyTaken);
      } catch {
        setNeedsTest(false);
      } finally {
        setChecking(false);
      }
    };

    checkTestStatus();
  }, [token]);

  if (!token) return <Navigate to="/login" replace />;
  if (checking) return <div className="min-h-screen flex items-center justify-center"><p className="text-sm text-muted-foreground">Loading...</p></div>;
  if (needsTest) return <Navigate to="/skill-test" replace />;
  return <Outlet />;
}
