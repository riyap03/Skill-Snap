import { useState, useEffect } from "react";
import { Sparkles, Github, Linkedin, Mail, MapPin, ExternalLink } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../../config/api";

const THEME = {
  background: "#ffffff",
  cardBg: "rgba(0,0,0,0.04)",
  accent: "#000000",
  secondary: "#666666",
  text: "#111111",
  muted: "#666666",
  border: "#eaeaea",
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">Loading…</div>;
  if (!portfolio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-gray-600">
        <h2 className="font-display text-2xl font-semibold">Portfolio not found</h2>
        <a href="/" className="text-sm text-black underline">← Back to home</a>
      </div>
    );
  }

  const activePortfolio = portfolioProp || portfolio;
  const displayName = activePortfolio.name || (username?.charAt(0).toUpperCase() + username?.slice(1));
  const bioText = activePortfolio.bio || activePortfolio.aiContent?.split("\n")[0] || "A passionate developer dedicated to building amazing things.";
  const rootClass = preview ? "rounded-2xl p-6" : "min-h-screen";
  const mainClass = preview ? "mx-auto max-w-3xl px-2 py-4" : "mx-auto max-w-2xl px-6 py-20";

  return (
    <div className={rootClass} style={{ background: THEME.background, color: THEME.text }}>
      <main className={mainClass}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gray-900 text-white text-xl font-bold mb-6">
            {displayName.slice(0, 2)}
          </div>
          <h1 className="font-display text-4xl font-light tracking-tight">{displayName}</h1>
          <p className="mt-2 text-sm" style={{ color: THEME.secondary }}>Developer · Open to opportunities</p>
          <p className="mt-4 text-sm text-gray-500 max-w-md mx-auto">{bioText}</p>
        </div>

        {activePortfolio.projects && activePortfolio.projects.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-8">Projects</h2>
            <div className="space-y-12">
              {activePortfolio.projects.map((project, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="text-sm font-medium">{project.title}</h3>
                    {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-black">link ↗</a>}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{project.description}</p>
                  {project.skills && project.skills.length > 0 && (
                    <div className="mt-2 flex gap-2 text-xs" style={{ color: THEME.secondary }}>
                      {project.skills.map((t) => <span key={t}>· {t}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {activePortfolio.aiContent && (
          <section className="mb-16">
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">About</h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-lg">{activePortfolio.aiContent}</p>
          </section>
        )}

        {!preview && (
          <footer className="pt-8 border-t text-center" style={{ borderColor: THEME.border }}>
            <p className="text-xs text-gray-400">© {new Date().getFullYear()} {displayName}</p>
          </footer>
        )}
      </main>
    </div>
  );
}
