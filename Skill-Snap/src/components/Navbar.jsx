import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../config/api";
import { Sparkles, Bell, ChevronDown, LogOut, Trash2, FlaskConical } from "lucide-react";

function Logo({ to = "/" }) {
  return (
    <Link to={to} className="flex items-center gap-2 group">
      <div className="relative h-8 w-8 rounded-lg bg-gradient-brand grid place-items-center shadow-[0_0_20px_-4px_var(--brand-purple)]">
        <Sparkles className="h-4 w-4 text-primary-foreground" />
      </div>
      <span className="font-display text-lg font-semibold tracking-tight">
        Skill<span className="text-gradient">Snap</span>
      </span>
    </Link>
  );
}

const appLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/projects", label: "Projects" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/assessment", label: "Assessment", icon: FlaskConical },
  { to: "/analytics", label: "Analytics" },
  { to: "/readiness", label: "Readiness" },
];

const siteLinks = [
  { to: "/#features", label: "Features", hash: true },
  { to: "/roadmap", label: "Roadmaps" },
  { to: "/portfolio", label: "Portfolio" },
];

function getNameFromToken(t) {
  if (!t) return null;
  try {
    const payload = t.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return json.name || json.username || null;
  } catch {
    return null;
  }
}

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  const name = getNameFromToken(token) || localStorage.getItem("name") || "Guest";
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isApp = ["/dashboard", "/roadmap", "/portfolio", "/test", "/assessment", "/assessment/result", "/coach", "/readiness", "/projects", "/analytics", "/onboarding"].some((p) =>
    pathname.startsWith(p)
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const deleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    try {
      await axios.delete(apiUrl("/api/auth/delete"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.clear();
      window.location.href = "/login";
    } catch (err) {
      alert("Failed to delete account");
      console.error(err);
    }
  };

  // SITE / LANDING NAVBAR
  if (!isApp) {
    return (
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            {siteLinks.map((l) =>
              l.hash ? (
                <a key={l.to} href={l.to} className="hover:text-foreground transition-colors">
                  {l.label}
                </a>
              ) : (
                <Link key={l.to} to={l.to} className="hover:text-foreground transition-colors">
                  {l.label}
                </Link>
              )
            )}
          </nav>
          <div className="flex items-center gap-2">
            {token ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-sm rounded-md bg-gradient-brand text-primary-foreground shadow-[0_0_24px_-6px_var(--brand-purple)] hover:opacity-90"
                >
                  Dashboard
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-border hover:bg-surface-elevated transition"
                  >
                    <div className="h-7 w-7 rounded-full bg-gradient-brand grid place-items-center text-xs font-semibold text-primary-foreground">
                      {initials}
                    </div>
                    <span className="hidden sm:block text-sm max-w-[100px] truncate">{name}</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-surface/90 backdrop-blur-xl shadow-lg overflow-hidden animate-fade-up z-50">
                      <div className="px-4 py-3 border-b border-border">
                        <div className="text-sm font-medium truncate">{name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Signed in</div>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => { setDropdownOpen(false); handleLogout(); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition"
                        >
                          <LogOut className="h-3.5 w-3.5" /> Logout
                        </button>
                        <button
                          onClick={() => { setDropdownOpen(false); deleteAccount(); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-surface-elevated transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete Account
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
                  Sign in
                </Link>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-sm rounded-md bg-gradient-brand text-primary-foreground shadow-[0_0_24px_-6px_var(--brand-purple)] hover:opacity-90"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }

  // APP NAVBAR
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Logo to="/dashboard" />
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {appLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md transition-colors ${
                    isActive
                      ? "text-foreground bg-surface-elevated"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                <div className="flex items-center gap-1.5">
                  {l.icon && <l.icon className="h-3.5 w-3.5" />}
                  <span>{l.label}</span>
                </div>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-9 w-9 grid place-items-center rounded-full hover:bg-surface-elevated transition">
            <Bell className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* USER DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-border hover:bg-surface-elevated transition"
            >
              <div className="h-7 w-7 rounded-full bg-gradient-brand grid place-items-center text-xs font-semibold text-primary-foreground">
                {initials}
              </div>
              <span className="hidden sm:block text-sm max-w-[100px] truncate">{name}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-surface/90 backdrop-blur-xl shadow-lg overflow-hidden animate-fade-up z-50">
                <div className="px-4 py-3 border-b border-border">
                  <div className="text-sm font-medium truncate">{name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Signed in</div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { setDropdownOpen(false); handleLogout(); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Logout
                  </button>
                  <button
                    onClick={() => { setDropdownOpen(false); deleteAccount(); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-surface-elevated transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
