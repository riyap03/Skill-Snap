import { useState, useEffect } from "react";
import { Sparkles, Github, Linkedin, Mail, MapPin, ExternalLink } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../config/api";

const THEME = {
  background: "#0f172a",
  cardBg: "#1e293b",
  accent: "#f59e0b",
  text: "#f1f5f9",
  muted: "#94a3b8",
  border: "#334155",
  gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
};

export default function PublicPortfolio({ portfolio: portfolioProp, username: usernameProp, preview = false }) {
  const { username: routeUsername } = useParams();
  const username = usernameProp || routeUsername;
  const [portfolio, setPortfolio] = useState(portfolioProp || null);
  const [loading, setLoading] = useState(!portfolioProp);

  useEffect(() => {
    if (portfolioProp) {
      setPortfolio(portfolioProp);
      setLoading(false);
      return;
    }

    if (!username) return;

    axios
      .get(apiUrl(`/api/portfolio/${username}`))
      .then((res) => setPortfolio(res.data))
      .catch(() => setPortfolio(null))
      .finally(() => setLoading(false));
  }, [username, portfolioProp]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: THEME.background, color: THEME.text }}>
        <p className="text-sm" style={{ color: THEME.muted }}>Loading portfolio…</p>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: THEME.background, color: THEME.text }}>
        <h2 className="font-display text-2xl font-semibold">Portfolio not found</h2>
        <p className="text-sm" style={{ color: THEME.muted }}>No portfolio for @{username}.</p>
        <a href="/" className="text-sm" style={{ color: THEME.accent }}>← Back to home</a>
      </div>
    );
  }

  const activePortfolio = portfolioProp || portfolio;
  const displayName = activePortfolio.name || (username.charAt(0).toUpperCase() + username.slice(1));
  const initials = displayName.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  const bioText = activePortfolio.bio || activePortfolio.aiContent?.split("\n")[0] || "A passionate developer dedicated to building amazing things.";
  const rootClass = preview ? "rounded-2xl p-6" : "min-h-screen";
  const mainClass = preview ? "mx-auto max-w-3xl px-2 py-4" : "mx-auto max-w-5xl px-6 py-16";

  return (
    <div className={rootClass} style={{ background: THEME.background, color: THEME.text }}>
      {!preview && (
        <header className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ background: "rgba(15,23,42,0.9)", borderColor: THEME.border }}>
          <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg grid place-items-center" style={{ background: THEME.gradient }}>
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-lg font-semibold" style={{ color: THEME.text }}>
                Skill<span style={{ color: THEME.accent }}>Snap</span>
              </span>
            </a>
            <span className="text-xs" style={{ color: THEME.muted }}>Professional portfolio</span>
          </div>
        </header>
      )}

      <main className={mainClass}>
        <div className="rounded-3xl p-10 sm:p-14 relative overflow-hidden mb-10" style={{ background: THEME.cardBg, border: `1px solid ${THEME.border}` }}>
          <div className="relative flex flex-col sm:flex-row gap-8 items-start">
            <div className="h-24 w-24 rounded-3xl grid place-items-center text-2xl font-display font-bold shadow-lg flex-shrink-0" style={{ background: THEME.gradient, color: "#fff" }}>
              {initials}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">{displayName}</h1>
              <p className="mt-2 text-lg" style={{ color: THEME.muted }}>Software Engineer · Open to opportunities</p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed" style={{ color: THEME.muted }}>{bioText}</p>
            </div>
          </div>
        </div>

        {activePortfolio.projects && activePortfolio.projects.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: THEME.accent }}>Featured Projects</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {activePortfolio.projects.map((project, i) => (
                <article key={i} className="rounded-2xl p-6" style={{ background: THEME.cardBg, border: `1px solid ${THEME.border}`, boxShadow: `0 1px 3px 0 ${THEME.border}` }}>
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="mt-2 text-sm" style={{ color: THEME.muted }}>{project.description}</p>
                  {project.skills && project.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.skills.map((t) => (
                        <span key={t} className="text-[11px] px-2 py-0.5 rounded-md" style={{ background: "rgba(245,158,11,0.15)", color: THEME.accent, border: `1px solid ${THEME.border}` }}>{t}</span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {activePortfolio.aiContent && (
          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: THEME.accent }}>About</h2>
            <div className="rounded-2xl p-6" style={{ background: THEME.cardBg, border: `1px solid ${THEME.border}` }}>
              <p className="text-sm leading-relaxed" style={{ color: THEME.muted }}>{activePortfolio.aiContent}</p>
            </div>
          </section>
        )}

        {!preview && (
          <footer className="mt-16 pt-8 border-t flex justify-between text-xs" style={{ borderColor: THEME.border, color: THEME.muted }}>
            <span>{displayName}</span>
            <span>© {new Date().getFullYear()}</span>
          </footer>
        )}
      </main>
    </div>
  );
}
