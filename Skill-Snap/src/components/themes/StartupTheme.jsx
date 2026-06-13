import { useState, useEffect } from "react";
import { Sparkles, Github, Linkedin, Mail, MapPin, ExternalLink } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../config/api";

const THEME = {
  background: "#0f172a",
  cardBg: "rgba(30,41,59,0.6)",
  accent: "#06b6d4",
  text: "#e2e8f0",
  muted: "#94a3b8",
  border: "rgba(6,182,212,0.2)",
  gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
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

    axios.get(apiUrl(`/api/portfolio/${username}`))
      .then((res) => setPortfolio(res.data))
      .catch(() => setPortfolio(null))
      .finally(() => setLoading(false));
  }, [username, portfolioProp]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: THEME.background, color: THEME.accent }}>
        <p className="text-sm" style={{ color: THEME.muted }}>Building profile…</p>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: THEME.background, color: THEME.text }}>
        <h2 className="font-display text-2xl font-semibold">Profile not found</h2>
        <p className="text-sm" style={{ color: THEME.muted }}>No portfolio for @{username}.</p>
        <a href="/" className="text-sm" style={{ color: THEME.accent }}>← Back to home</a>
      </div>
    );
  }

  const activePortfolio = portfolioProp || portfolio;
  const displayName = activePortfolio.name || (username.charAt(0).toUpperCase() + username.slice(1));
  const bioText = activePortfolio.bio || activePortfolio.aiContent?.split("\n")[0] || "A passionate developer dedicated to building amazing things.";
  const rootClass = preview ? "rounded-2xl p-6" : "min-h-screen";
  const mainClass = preview ? "mx-auto max-w-3xl px-2 py-4" : "mx-auto max-w-6xl px-6 py-20";

  return (
    <div className={rootClass} style={{ background: THEME.background, color: THEME.text }}>
      {!preview && (
        <header className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ background: "rgba(15,23,42,0.8)", borderColor: THEME.border }}>
          <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg grid place-items-center" style={{ background: THEME.gradient, color: "white" }}>
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold" style={{ color: THEME.text }}>
                {displayName}
              </span>
            </a>
            <div className="flex gap-4 text-sm" style={{ color: THEME.muted }}>
              <a href="#projects" className="hover:text-white transition">Work</a>
            </div>
          </div>
        </header>
      )}

      <main className={mainClass}>
        {/* Hero with metrics */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <h1 className="text-5xl font-display font-bold tracking-tight leading-tight">
              Building digital products,<br />
              <span style={{ color: THEME.accent }}>brands,</span> and experiences.
            </h1>
            <p className="mt-4 text-base text-gray-400">{bioText}</p>
            <div className="mt-6 flex gap-3">
              {activePortfolio.github && <a href={activePortfolio.github} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg border text-sm hover:border-cyan-500 transition" style={{ borderColor: THEME.border, color: THEME.muted }}>GitHub</a>}
              {activePortfolio.linkedin && <a href={activePortfolio.linkedin} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg text-sm text-white hover:opacity-90" style={{ background: THEME.gradient }}>Let's Connect →</a>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { val: (activePortfolio.projects?.length || 0) + "+", label: "Projects built" },
              { val: (activePortfolio.aiContent ? "AI" : "0") + "%", label: "Portfolio ready" },
              { val: "100%", label: "Client focus" },
              { val: "24/7", label: "Available" },
            ].map((m, i) => (
              <div key={i} className="rounded-2xl p-6" style={{ background: THEME.cardBg, border: `1px solid ${THEME.border}` }}>
                <div className="text-3xl font-display font-bold" style={{ color: THEME.accent }}>{m.val}</div>
                <div className="text-xs mt-1" style={{ color: THEME.muted }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {activePortfolio.projects && activePortfolio.projects.length > 0 && (
          <section id="projects" className="mb-16">
            <h2 className="text-xs uppercase tracking-[0.2em] mb-6" style={{ color: THEME.accent }}>Selected Work</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {activePortfolio.projects.map((project, i) => (
                <article key={i} className="rounded-2xl p-6 group cursor-pointer" style={{ background: THEME.cardBg, border: `1px solid ${THEME.border}` }}>
                  <h3 className="text-base font-medium group-hover:text-cyan-400 transition">{project.title}</h3>
                  <p className="mt-2 text-sm" style={{ color: THEME.muted }}>{project.description}</p>
                  {project.skills && project.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.skills.map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-md" style={{ background: "rgba(6,182,212,0.15)", color: THEME.accent }}>{t}</span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {!preview && (
          <footer className="pt-8 border-t flex justify-between text-xs" style={{ borderColor: THEME.border, color: THEME.muted }}>
            <span>© {new Date().getFullYear()} {displayName}</span>
            <span>Built with SkillSnap</span>
          </footer>
        )}
      </main>
    </div>
  );
}
