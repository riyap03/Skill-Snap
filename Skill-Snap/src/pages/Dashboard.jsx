import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../config/api";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Map,
  Briefcase,
  FlaskConical,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";

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

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const name = getNameFromToken(token) || localStorage.getItem("name") || "there";
  const username = localStorage.getItem("name")?.toLowerCase() || "user";

  const [testStatus, setTestStatus] = useState(null);   // { hasTakenTest, level }
  const [roadmaps, setRoadmaps] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [testRes, roadmapRes] = await Promise.all([
          axios.get(apiUrl("/api/progress/check"), authHeader),
          axios.get(apiUrl("/api/roadmaps"), authHeader),
        ]);

        setTestStatus(testRes.data);
        setRoadmaps(roadmapRes.data.roadmaps || []);

        // portfolio is optional — don't fail if missing
        try {
          const portfolioRes = await axios.get(apiUrl(`/api/portfolio/${username}`), authHeader);
          setPortfolio(portfolioRes.data);
        } catch {
          setPortfolio(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const activeRoadmaps = roadmaps.filter((r) => (r.progress ?? 0) > 0);
  const totalSkills = roadmaps.reduce((acc, r) => acc + (r.skills?.length || 0), 0);
  const projectCount = portfolio?.projects?.length ?? 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading your dashboard…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* GREETING HEADER */}
        <div className="relative card-glow rounded-3xl p-8 sm:p-12 overflow-hidden mb-8">
          <div
            className="absolute -top-20 -right-20 h-72 w-72 rounded-full opacity-20 pointer-events-none"
            style={{ background: "var(--gradient-brand)", filter: "blur(80px)" }}
          />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-sm text-muted-foreground">{greeting},</p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mt-1 capitalize">
                {name} 👋
              </h1>
              <p className="mt-2 text-muted-foreground text-sm max-w-md">
                {testStatus?.hasTakenTest
                  ? "Your personalized roadmap is ready. Keep the momentum going."
                  : "Take the skill assessment to unlock your personalized roadmap."}
              </p>
            </div>
            {!testStatus?.hasTakenTest && (
              <Link
                to="/test"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-sm font-medium shadow-[0_0_24px_-6px_var(--brand-purple)] hover:opacity-90 shrink-0"
              >
                <Sparkles className="h-4 w-4" /> Take Skill Test
              </Link>
            )}
            {testStatus?.hasTakenTest && (
              <Link
                to="/roadmap"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-sm font-medium shadow-[0_0_24px_-6px_var(--brand-purple)] hover:opacity-90 shrink-0"
              >
                Continue Learning <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: FlaskConical,
              label: "Skill Assessment",
              value: testStatus?.hasTakenTest ? "Completed" : "Not taken",
              sub: testStatus?.hasTakenTest ? "Level unlocked" : "Take the test",
              ok: testStatus?.hasTakenTest,
            },
            {
              icon: Map,
              label: "Active Roadmaps",
              value: activeRoadmaps.length,
              sub: `${roadmaps.length} total available`,
              ok: activeRoadmaps.length > 0,
            },
            {
              icon: TrendingUp,
              label: "Skills Tracked",
              value: totalSkills,
              sub: "Across all roadmaps",
              ok: totalSkills > 0,
            },
            {
              icon: Briefcase,
              label: "Portfolio Projects",
              value: projectCount,
              sub: projectCount > 0 ? "Projects added" : "None yet",
              ok: projectCount > 0,
            },
          ].map((stat) => (
            <div key={stat.label} className="card-glow rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-brand grid place-items-center shadow-[0_0_16px_-4px_var(--brand-purple)]">
                  <stat.icon className="h-4 w-4 text-primary-foreground" />
                </div>
                {stat.ok
                  ? <CheckCircle2 className="h-4 w-4 text-brand-pink" />
                  : <AlertCircle className="h-4 w-4 text-muted-foreground" />
                }
              </div>
              <div className="text-2xl font-display font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground opacity-60 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ROADMAPS */}
          <div className="lg:col-span-2 card-glow rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold">Your Roadmaps</h2>
              <Link to="/roadmap" className="text-xs text-brand-pink hover:opacity-80 flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {roadmaps.length === 0 ? (
              <div className="text-center py-10">
                <Map className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No roadmaps yet.</p>
                <Link to="/roadmap" className="mt-3 inline-flex items-center gap-1 text-xs text-brand-pink hover:opacity-80">
                  Browse roadmaps <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {roadmaps.slice(0, 4).map((r) => {
                  const progress = r.progress ?? 0;
                  const name = r.title || r.roadmapName;
                  return (
                    <div key={r.roadmapName}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="font-medium">{name}</span>
                        <span className="text-xs text-muted-foreground">{progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-elevated overflow-hidden">
                        <div
                          className="h-full bg-gradient-brand shadow-[0_0_8px_var(--brand-purple)] transition-all duration-700"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      {r.skills?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {r.skills.slice(0, 4).map((s) => (
                            <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-surface-elevated text-muted-foreground border border-border">
                              {s}
                            </span>
                          ))}
                          {r.skills.length > 4 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-surface-elevated text-muted-foreground border border-border">
                              +{r.skills.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">

            {/* SKILL TEST STATUS */}
            <div className="card-glow rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-brand-pink" />
                <h2 className="font-semibold text-sm">Skill Assessment</h2>
              </div>
              {testStatus?.hasTakenTest ? (
                <div>
                  <div className="flex items-center gap-2 text-sm text-green-400 mb-1">
                    <CheckCircle2 className="h-4 w-4" /> Completed
                  </div>
                  <p className="text-xs text-muted-foreground">
                    SkillSnap has personalized your roadmaps based on your results.
                  </p>
                  <Link to="/test" className="mt-3 inline-flex items-center gap-1 text-xs text-brand-pink hover:opacity-80">
                    Retake test <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Complete the assessment so SkillSnap can personalize your learning path.
                  </p>
                  <Link
                    to="/test"
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-brand text-primary-foreground text-xs font-medium w-full justify-center"
                  >
                    Start assessment <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>

            {/* PORTFOLIO */}
            <div className="card-glow rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="h-4 w-4 text-brand-pink" />
                <h2 className="font-semibold text-sm">Portfolio</h2>
              </div>
              {projectCount > 0 ? (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    You have <span className="text-foreground font-medium">{projectCount} project{projectCount > 1 ? "s" : ""}</span> in your portfolio.
                  </p>
                  {portfolio?.projects?.slice(0, 2).map((p) => (
                    <div key={p.title} className="mt-2 text-xs px-3 py-2 rounded-lg bg-surface/60 border border-border text-muted-foreground">
                      {p.title}
                    </div>
                  ))}
                  <Link to="/portfolio" className="mt-3 inline-flex items-center gap-1 text-xs text-brand-pink hover:opacity-80">
                    Edit portfolio <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Add projects and generate an AI-powered bio to share with recruiters.
                  </p>
                  <Link
                    to="/portfolio"
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-brand text-primary-foreground text-xs font-medium w-full justify-center"
                  >
                    Build portfolio <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>

            {/* QUICK LINKS */}
            <div className="card-glow rounded-2xl p-5">
              <h2 className="font-semibold text-sm mb-3">Quick Links</h2>
              <div className="space-y-1">
                {[
                  { to: "/roadmap", label: "Browse Roadmaps", icon: Map },
                  { to: "/portfolio", label: "Portfolio Builder", icon: Briefcase },
                  { to: "/test", label: "Skill Test", icon: FlaskConical },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                    <ArrowRight className="h-3 w-3 ml-auto" />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}




