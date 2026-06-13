import { useState, useEffect } from "react";
import { Sparkles, Github, Linkedin, Mail, MapPin, ExternalLink } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../config/api";

const THEME = {
  background: "#050505",
  cardBg: "#0d0d0d",
  accent: "#00ff88",
  text: "#e0e0e0",
  muted: "#7a7a7a",
  border: "#1a1a1a",
  prompt: "#00ff88",
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
      <div className="min-h-screen flex items-center justify-center font-mono" style={{ background: THEME.background, color: THEME.accent }}>
        <p>&gt; Loading portfolio...</p>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 font-mono" style={{ background: THEME.background, color: THEME.text }}>
        <h2 className="font-display text-2xl font-semibold">&gt; portfolio not found</h2>
        <p className="text-sm" style={{ color: THEME.muted }}>No portfolio for @{username}.</p>
        <a href="/" className="text-sm" style={{ color: THEME.accent }}>← /home</a>
      </div>
    );
  }

  const activePortfolio = portfolioProp || portfolio;
  const displayName = activePortfolio.name || (username.charAt(0).toUpperCase() + username.slice(1));
  const bioText = activePortfolio.bio || activePortfolio.aiContent?.split("\n")[0] || "A passionate developer dedicated to building amazing things.";
  const rootClass = preview ? "rounded-2xl p-6" : "min-h-screen font-mono";
  const mainClass = preview ? "mx-auto max-w-3xl px-2 py-4" : "mx-auto max-w-5xl px-6 py-16";

  return (
    <div className={rootClass} style={{ background: THEME.background, color: THEME.text }}>
      {!preview && (
        <header className="sticky top-0 z-40 backdrop-blur-xl" style={{ background: "rgba(5,5,5,0.9)", borderBottom: `1px solid ${THEME.border}` }}>
          <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded grid place-items-center" style={{ background: THEME.cardBg, border: `1px solid ${THEME.accent}`, color: THEME.accent }}>
                <span style={{ color: THEME.accent }}>&gt;_</span>
              </div>
              <span className="font-mono text-sm" style={{ color: THEME.text }}>
                Skill<span style={{ color: THEME.accent }}>Snap</span>
              </span>
            </a>
            <span className="text-xs" style={{ color: THEME.muted }}>root@portfolio ~ % cat profile</span>
          </div>
        </header>
      )}

      <main className={mainClass}>
        <div className="rounded-2xl p-8 mb-10" style={{ background: THEME.cardBg, border: `1px solid ${THEME.border}` }}>
          <div style={{ color: THEME.accent }} className="mb-4">
            &gt; whoami<br />
            &gt; name: {displayName}<br />
            &gt; role: developer<br />
          </div>
          <p className="text-sm leading-relaxed" style={{ color: THEME.muted }}>{bioText}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs" style={{ color: THEME.muted }}>
            {activePortfolio.github && <a href={activePortfolio.github} target="_blank" rel="noopener noreferrer" style={{ color: THEME.accent }}>github →</a>}
            {activePortfolio.linkedin && <a href={activePortfolio.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: THEME.accent }}>linkedin →</a>}
          </div>
        </div>

        {activePortfolio.aiContent && (
          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: THEME.accent }}># AI Summary</h2>
            <div className="rounded-2xl p-6" style={{ background: THEME.cardBg, border: `1px solid ${THEME.border}` }}>
              <pre className="text-xs whitespace-pre-wrap leading-relaxed" style={{ color: THEME.muted }}>{activePortfolio.aiContent}</pre>
            </div>
          </section>
        )}

        {activePortfolio.projects && activePortfolio.projects.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: THEME.accent }}># Projects</h2>
            <div className="space-y-4">
              {activePortfolio.projects.map((project, i) => (
                <div key={i} className="rounded-2xl p-6" style={{ background: THEME.cardBg, border: `1px solid ${THEME.border}` }}>
                  <h3 className="text-base font-display font-semibold" style={{ color: THEME.text }}>$ ./{project.title.toLowerCase().replace(/\s+/g, "_")}</h3>
                  <p className="mt-2 text-sm" style={{ color: THEME.muted }}>{project.description}</p>
                  {project.skills && project.skills.length > 0 && (
                    <div className="mt-3 font-mono" style={{ color: THEME.accent }}>
                      &gt; {project.skills.join(" | ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {!preview && (
          <footer className="mt-16 pt-8 border-t flex justify-between text-xs" style={{ borderColor: THEME.border, color: THEME.muted }}>
            <span>&copy; {new Date().getFullYear()} {displayName}</span>
            <span style={{ color: THEME.accent }}>$ exit</span>
          </footer>
        )}
      </main>
    </div>
  );
}
