import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Sparkles, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { apiUrl } from "../config/api";

export default function PublicPortfolio() {
  const { username } = useParams();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(apiUrl(`/api/portfolio/${username}`))
      .then((res) => {
        setPortfolio(res.data);
      })
      .catch(() => {
        setPortfolio(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [username]);

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading portfolio…</div>
      </div>
    );
  }

  // NOT FOUND STATE
  if (!portfolio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <h2 className="font-display text-2xl font-semibold">Portfolio not found</h2>
        <p className="text-sm text-muted-foreground">No portfolio exists for <span className="text-foreground">@{username}</span>.</p>
        <Link to="/" className="mt-2 text-sm text-brand-pink hover:opacity-80">← Back to home</Link>
      </div>
    );
  }

  // Derive display name from username
  const displayName =
    portfolio.name ||
    (username.charAt(0).toUpperCase() + username.slice(1));

  const initials = displayName
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen">

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border">
        <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-brand grid place-items-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-semibold">
              Skill<span className="text-gradient">Snap</span>
            </span>
          </Link>
          <span className="text-xs text-muted-foreground">Public portfolio</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">

        {/* HERO CARD */}
        <div className="card-glow rounded-3xl p-10 sm:p-14 relative overflow-hidden">
          <div
            className="absolute -top-32 -right-20 h-80 w-80 rounded-full opacity-25"
            style={{ background: "var(--gradient-brand)", filter: "blur(100px)" }}
          />
          <div className="relative flex flex-col sm:flex-row gap-8 items-start">
            <div className="h-24 w-24 rounded-3xl bg-gradient-brand grid place-items-center text-2xl font-display font-bold text-primary-foreground shadow-[0_0_40px_-8px_var(--brand-purple)]">
              {initials}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
                {displayName}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {portfolio.title || "Developer · Open to opportunities"}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {portfolio.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {portfolio.location}
                  </span>
                )}
                {portfolio.github && (
                  <a href={portfolio.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-foreground">
                    <Github className="h-3.5 w-3.5" /> github
                  </a>
                )}
                {portfolio.linkedin && (
                  <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-foreground">
                    <Linkedin className="h-3.5 w-3.5" /> linkedin
                  </a>
                )}
                {portfolio.email && (
                  <a href={`mailto:${portfolio.email}`} className="flex items-center gap-1.5 hover:text-foreground">
                    <Mail className="h-3.5 w-3.5" /> contact
                  </a>
                )}
              </div>
              {portfolio.bio && (
                <p className="mt-6 max-w-2xl text-sm leading-relaxed">
                  {portfolio.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* AI CONTENT SUMMARY */}
        {portfolio.aiContent && (
          <section className="mt-12">
            <h2 className="text-xs uppercase tracking-[0.2em] text-brand-pink">
              AI Portfolio Summary
            </h2>
            <div className="mt-4 card-glow rounded-2xl p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-pink mb-3">
                <Sparkles className="h-4 w-4" /> Generated Summary
              </div>
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {portfolio.aiContent}
              </pre>
            </div>
          </section>
        )}

        {/* SKILLS */}
        {portfolio.skills && portfolio.skills.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xs uppercase tracking-[0.2em] text-brand-pink">Tech stack</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {portfolio.skills.map((s) => (
                <span
                  key={s}
                  className="text-sm px-3 py-1 rounded-md bg-surface/60 border border-border"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {portfolio.projects && portfolio.projects.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xs uppercase tracking-[0.2em] text-brand-pink">
              Featured projects
            </h2>
            <div className="mt-4 grid md:grid-cols-2 gap-5">
              {portfolio.projects.map((project) => (
                <article key={project.title} className="card-glow rounded-2xl p-6">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  {project.skills && project.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.skills.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-surface-elevated text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* TIMELINE */}
        {portfolio.timeline && portfolio.timeline.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xs uppercase tracking-[0.2em] text-brand-pink">
              Growth timeline
            </h2>
            <ol className="mt-6 relative border-l border-border pl-6 space-y-6">
              {portfolio.timeline.map((item) => (
                <li key={item.year || item.y} className="relative">
                  <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-gradient-brand shadow-[0_0_12px_var(--brand-purple)]" />
                  <div className="text-xs text-muted-foreground">
                    {item.year || item.y}
                  </div>
                  <div className="text-sm">{item.title || item.t}</div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* FOOTER */}
        <footer className="mt-16 pt-8 border-t border-border text-xs text-muted-foreground flex justify-between">
          <span>Made with SkillSnap</span>
          <span>© {new Date().getFullYear()} {displayName}</span>
        </footer>

      </main>
    </div>
  );
}