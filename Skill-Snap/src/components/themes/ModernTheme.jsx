import { useState, useEffect } from "react";
import { Sparkles, Github, Linkedin, Mail, MapPin, ExternalLink } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../config/api";

const THEME = {
  background: "#0a0a1a",
  cardBg: "rgba(20,20,40,0.7)",
  accent: "#8b5cf6",
  text: "#e2e8f0",
  muted: "#94a3b8",
  border: "rgba(255,255,255,0.1)",
  gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
  shadow: "0 0 40px rgba(139,92,246,0.3)",
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
        <header className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ background: "rgba(10,10,26,0.7)", borderColor: THEME.border }}>
          <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg grid place-items-center" style={{ background: THEME.gradient }}>
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-lg font-semibold" style={{ color: THEME.text }}>
                Skill<span style={{ color: THEME.accent }}>Snap</span>
              </span>
            </a>
            <span className="text-xs" style={{ color: THEME.muted }}>Public portfolio</span>
          </div>
        </header>
      )}

      <main className={mainClass}>
        {/* Hero */}
        <div className="rounded-3xl p-10 sm:p-14 relative overflow-hidden mb-10" style={{ background: THEME.cardBg, border: `1px solid ${THEME.border}` }}>
          <div className="relative flex flex-col sm:flex-row gap-8 items-start">
            <div className="h-24 w-24 rounded-3xl grid place-items-center text-2xl font-display font-bold text-white shadow-lg flex-shrink-0" style={{ background: THEME.gradient, boxShadow: THEME.shadow }}>
              {initials}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">{displayName}</h1>
              <p className="mt-2" style={{ color: THEME.muted }}>Developer · Open to opportunities</p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm" style={{ color: THEME.muted }}>
                {activePortfolio.github && <a href={activePortfolio.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white"><Github className="h-3.5 w-3.5" /> github</a>}
                {activePortfolio.linkedin && <a href={activePortfolio.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white"><Linkedin className="h-3.5 w-3.5" /> linkedin</a>}
              </div>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed">{bioText}</p>
            </div>
          </div>
        </div>

        {/* AI Content Summary */}
        {activePortfolio.aiContent && (
          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: THEME.accent }}>AI Portfolio Summary</h2>
            <div className="rounded-2xl p-6" style={{ background: THEME.cardBg, border: `1px solid ${THEME.border}` }}>
              <pre className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: THEME.muted }}>{activePortfolio.aiContent}</pre>
            </div>
          </section>
        )}

        {/* Projects */}
        {activePortfolio.projects && activePortfolio.projects.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: THEME.accent }}>Featured Projects</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {activePortfolio.projects.map((project, i) => (
                <article key={i} className="rounded-2xl p-6" style={{ background: THEME.cardBg, border: `1px solid ${THEME.border}` }}>
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: THEME.muted }} className="hover:text-white"><ExternalLink className="h-4 w-4" /></a>}
                  </div>
                  <p className="mt-2 text-sm" style={{ color: THEME.muted }}>{project.description}</p>
                  {project.skills && project.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.skills.map((t) => (
                        <span key={t} className="text-[11px] px-2 py-0.5 rounded-md" style={{ background: "rgba(139,92,246,0.15)", color: THEME.accent }}>{t}</span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        {!preview && (
          <footer className="mt-16 pt-8 border-t flex justify-between text-xs" style={{ borderColor: THEME.border, color: THEME.muted }}>
            <span>Made with SkillSnap</span>
            <span>© {new Date().getFullYear()} {displayName}</span>
          </footer>
        )}
      </main>
    </div>
  );
}
