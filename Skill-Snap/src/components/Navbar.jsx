import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../config/api";
import { Bell, ChevronDown, LogOut, Trash2 } from "lucide-react";
import { navGroups } from "../config/design-system";

function getNameFromToken(t) {
  if (!t) return null;
  try { const payload = t.split(".")[1]; const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))); return json.name || json.username || null; } catch { return null; }
}

function Logo({ to = "/" }) {
  return <Link to={to} className="flex items-center gap-2.5 group"><span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#2f7564] text-white text-sm font-semibold">S</span><span className="text-[17px] font-semibold tracking-[-.04em]">Skill<span className="text-[#2f7564]">Snap</span></span></Link>;
}

const siteLinks = [{ to: "/#features", label: "Features", hash: true }, { to: "/roadmap", label: "Roadmaps" }, { to: "/portfolio", label: "Portfolio" }];

export default function Navbar() {
  const { pathname } = useLocation(); const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false); const dropdownRef = useRef(null);
  const token = localStorage.getItem("token"); const name = getNameFromToken(token) || localStorage.getItem("name") || "Guest";
  const initials = name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  const isApp = ["/dashboard", "/roadmap", "/portfolio", "/test", "/assessment", "/coach", "/readiness", "/projects", "/analytics", "/onboarding"].some((p) => pathname.startsWith(p));
  useEffect(() => { const fn = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); }; document.addEventListener("mousedown", fn); return () => document.removeEventListener("mousedown", fn); }, []);
  const logout = () => { localStorage.removeItem("token"); navigate("/login"); };
  const deleteAccount = async () => { if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return; try { await axios.delete(apiUrl("/api/auth/delete"), { headers: { Authorization: `Bearer ${token}` } }); localStorage.clear(); window.location.href = "/login"; } catch { alert("Failed to delete account"); } };

  if (!isApp) return <header className="sticky top-0 z-40 border-b border-[#dfe7df] bg-[#f7f8f3]/90 backdrop-blur-xl"><div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6"><Logo /><nav className="hidden items-center gap-8 text-sm text-[#6d7b75] md:flex">{siteLinks.map((l) => l.hash ? <a key={l.to} href={l.to} className="hover:text-[#18302b]">{l.label}</a> : <Link key={l.to} to={l.to} className="hover:text-[#18302b]">{l.label}</Link>)}</nav><div className="flex items-center gap-3">{token ? <Link to="/dashboard" className="rounded-md bg-[#2f7564] px-4 py-2 text-sm text-white hover:bg-[#245e50]">Open workspace</Link> : <><Link to="/login" className="px-2 py-2 text-sm text-[#6d7b75] hover:text-[#18302b]">Sign in</Link><Link to="/dashboard" className="rounded-md bg-[#2f7564] px-4 py-2 text-sm text-white hover:bg-[#245e50]">Get started</Link></>}</div></div></header>;

  return <>
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-[#dfe7df] bg-[#f7f8f3] px-5 py-6 md:flex md:flex-col">
      <Logo to="/dashboard" /><div className="mt-12 flex-1 space-y-8">{navGroups.map((group) => <div key={group.label}><div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#93a19b]">{group.label}</div><nav className="space-y-1">{group.items.map((item) => <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] ${isActive ? "bg-[#e3f0ea] font-semibold text-[#2f7564]" : "text-[#6d7b75] hover:bg-[#eef3ee] hover:text-[#18302b]"}`}><span className="w-4 text-center text-sm opacity-80">{item.glyph}</span>{item.label}</NavLink>)}</nav></div>)}</div>
      <div className="relative border-t border-[#dfe7df] pt-4" ref={dropdownRef}><button onClick={() => setDropdownOpen((v) => !v)} className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-[#eef3ee]"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#d5e6dd] text-xs font-semibold text-[#2f7564]">{initials}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{name}</span><span className="block text-xs text-[#93a19b]">Personal workspace</span></span><ChevronDown className={`h-4 w-4 text-[#93a19b] ${dropdownOpen ? "rotate-180" : ""}`} /></button>{dropdownOpen && <div className="absolute bottom-14 left-0 w-full overflow-hidden rounded-md border border-[#dfe7df] bg-white shadow-lg"><button onClick={logout} className="flex w-full items-center gap-2 px-4 py-3 text-sm text-[#6d7b75] hover:bg-[#eef3ee]"><LogOut className="h-4 w-4" /> Log out</button><button onClick={deleteAccount} className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Delete account</button></div>}</div>
    </aside>
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#dfe7df] bg-[#f7f8f3]/90 px-5 backdrop-blur-xl md:hidden"><Logo to="/dashboard" /><button className="grid h-9 w-9 place-items-center rounded-md border border-[#dfe7df]"><Bell className="h-4 w-4 text-[#6d7b75]" /></button></header>
    <nav className="fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-4 border-t border-[#dfe7df] bg-[#f7f8f3]/95 backdrop-blur-xl md:hidden">{navGroups[0].items.slice(0, 4).map((item) => <NavLink key={item.to} to={item.to} className={({ isActive }) => `grid place-items-center gap-0.5 text-[10px] ${isActive ? "font-semibold text-[#2f7564]" : "text-[#93a19b]"}`}><span className="text-base">{item.glyph}</span>{item.label}</NavLink>)}</nav>
  </>;
}
