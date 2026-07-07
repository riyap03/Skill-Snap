import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../config/api";

import {
  Search,
  Clock,
  ChevronRight,
  X,
  Sparkles,
  Download,
  Target,
  Gauge,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Roadmap() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState({});
  const [skillOrder, setSkillOrder] = useState([]);
  const [plan, setPlan] = useState(null);
  const [stats, setStats] = useState(null);
  const [insight, setInsight] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [listError, setListError] = useState("");
  const [showTestPopup, setShowTestPopup] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const slugify = (name) =>
    name.replace(/\s+/g, "-").replace(/\//g, "-").toLowerCase();

  const applyPlan = (roadmapPlan) => {
    setPlan(roadmapPlan);
    setChecked(roadmapPlan.skills || {});
    setSkillOrder(
      roadmapPlan.skillOrder || Object.keys(roadmapPlan.skills || {})
    );
  };

  // Check if user has taken test
  useEffect(() => {
    const checkTest = async () => {
      try {
        const res = await axios.get(apiUrl("/api/progress/check"), getAuthHeader());
        if (!res.data.hasTakenTest) setShowTestPopup(true);
      } catch (err) {
        console.error(err);
      }
    };
    checkTest();
  }, []);

  // Load roadmap list
  useEffect(() => {
    const loadRoadmaps = async () => {
      try {
        setListError("");
        const res = await axios.get(apiUrl("/api/roadmaps"), getAuthHeader());
        setRoadmaps(res.data.roadmaps || []);
      } catch (err) {
        console.error(err);
        setRoadmaps([]);
        setListError(
          "Roadmaps could not be loaded. Please make sure the backend is running."
        );
      }
    };
    loadRoadmaps();
  }, []);

  // Load selected roadmap data
  useEffect(() => {
    if (!selected) {
      setChecked({});
      setSkillOrder([]);
      setPlan(null);
      setStats(null);
      setInsight(null);
      setProjects([]);
      setError("");
      return;
    }

    const slug = slugify(selected);
    setLoading(true);
    setError("");

    const loadRoadmap = async () => {
      try {
        const [roadmapRes, statsRes, insightRes, projectsRes] = await Promise.all([
          axios.get(apiUrl(`/api/roadmaps/${slug}`), getAuthHeader()),
          axios.get(apiUrl(`/api/roadmaps/${slug}/stats?range=weekly`), getAuthHeader()),
          axios.get(apiUrl(`/api/roadmaps/${slug}/insights`), getAuthHeader()),
          axios.get(apiUrl("/api/roadmaps/projects/recommend"), getAuthHeader()),
        ]);

        applyPlan(roadmapRes.data);
        setStats(statsRes.data);
        setInsight(insightRes.data.message);
        setProjects(projectsRes.data.projects || []);
      } catch {
        setChecked({});
        setSkillOrder([]);
        setPlan(null);
        setStats(null);
        setInsight(null);
        setProjects([]);
        setError("Roadmap could not be loaded. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadRoadmap();
  }, [selected]);

  // Toggle skill checkbox
  const toggleSkill = async (skill) => {
    const newStatus = !checked[skill];
    const slug = slugify(selected);
    setChecked((prev) => ({ ...prev, [skill]: newStatus }));

    try {
      const res = await axios.patch(
        apiUrl(`/api/roadmaps/${slug}/skill`),
        { skillName: skill, status: newStatus },
        getAuthHeader()
      );
      if (res.data.skills) applyPlan(res.data);

      const [statsRes, insightRes, projectsRes] = await Promise.all([
        axios.get(apiUrl(`/api/roadmaps/${slug}/stats?range=weekly`), getAuthHeader()),
        axios.get(apiUrl(`/api/roadmaps/${slug}/insights`), getAuthHeader()),
        axios.get(apiUrl("/api/roadmaps/projects/recommend"), getAuthHeader()),
      ]);

      setStats(statsRes.data);
      setInsight(insightRes.data.message);
      setProjects(projectsRes.data.projects || []);
    } catch {
      setChecked((prev) => ({ ...prev, [skill]: !newStatus }));
    }
  };

  // Export PDF
  const exportPDF = async () => {
    if (!selected) return;
    const slug = slugify(selected);
    try {
      const res = await axios.get(apiUrl(`/api/roadmaps/${slug}/export`), {
        ...getAuthHeader(),
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slug}-roadmap.pdf`;
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  const total = plan?.total ?? (selected ? Object.keys(checked).length : 0);
  const completed = plan?.completed ?? Object.values(checked).filter(Boolean).length;
  const progress = plan?.progress ?? (total ? Math.round((completed / total) * 100) : 0);
  const selectedTitle = plan?.title || selected?.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");

  const chartData = stats
    ? Object.entries(stats).map(([date, value]) => ({ date, value }))
    : [];

  const filteredRoadmaps = roadmaps.filter((r) => {
    const query = search.trim().toLowerCase();
    const title = r.title || r.roadmapName || "";
    const skills = (r.skills || []).join(" ");

    return `${title} ${r.roadmapName || ""} ${skills}`
      .toLowerCase()
      .includes(query);
  });

  return (
    <div className="min-h-screen relative">
      
      <main className="mx-auto max-w-7xl px-6 py-10">

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Adaptive roadmap
            </div>
            <h1 className="mt-4 font-display text-3xl sm:text-4xl font-bold tracking-tight">Roadmaps</h1>
            <p className="mt-1 text-muted-foreground">Pick a learning path. SkillSnap adjusts focus by pace, profile, and progress.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search technologies, frameworks…"
                className="w-full pl-9 pr-3 h-11 rounded-xl bg-surface/60 border border-border outline-none focus:border-primary text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={exportPDF}
              disabled={!selected}
              className="inline-flex items-center px-3 py-2.5 rounded-xl border border-border text-sm hover:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Download className="h-4 w-4 mr-1.5" /> Export PDF
            </button>
          </div>
        </div>

        {plan && (
          <section className="mt-8 rounded-2xl border border-border bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-primary">Current path</div>
                <h2 className="mt-2 text-2xl font-display font-bold">{selectedTitle}</h2>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{plan.pace?.message}</p>
              </div>
              <div className="min-w-36 text-right">
                <div className="text-3xl font-display font-bold">{progress}%</div>
                <div className="text-xs text-muted-foreground">{completed} of {total} completed</div>
              </div>
            </div>
            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-surface-elevated">
              <div className="h-full rounded-full bg-gradient-brand transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Gauge, label: "Pace", value: plan.pace?.pace || "new" },
                { icon: Target, label: "Weekly target", value: `${plan.weeklyTarget || 0} skills` },
                { icon: CalendarDays, label: "Estimated finish", value: `${plan.estimatedWeeks || 1} weeks` },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-background/40 p-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <item.icon className="h-4 w-4 text-primary" />
                    {item.label}
                  </div>
                  <div className="mt-2 text-lg font-semibold capitalize">{item.value}</div>
                </div>
              ))}
            </div>
            {plan.nextFocus?.length > 0 && (
              <div className="mt-5">
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-primary">Next focus</div>
                <div className="flex flex-wrap gap-2">
                  {plan.nextFocus.map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs text-primary">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {listError && (
          <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {listError}
          </div>
        )}

        {!listError && filteredRoadmaps.length === 0 && (
          <div className="mt-8 rounded-xl border border-border bg-surface/40 px-4 py-8 text-center text-sm text-muted-foreground">
            No roadmaps found. Try a different search.
          </div>
        )}

        <div className="mt-8 space-y-3">
          {filteredRoadmaps.map((r) => {
            const name = r.title || r.roadmapName;
            const isSelected = selected === r.roadmapName;
            const rowProgress = isSelected ? (plan?.progress ?? r.progress ?? 0) : (r.progress ?? 0);
            const rowSkills = isSelected ? skillOrder : (r.skills || []);

            return (
              <div
                key={r.roadmapName}
                className={`rounded-2xl border bg-surface transition-all ${isSelected ? "border-primary/70 shadow-[0_0_0_1px_rgba(59,130,246,0.18)]" : "border-border hover:border-primary/40"}`}
              >
                <div
                  className="flex items-center justify-between p-5 cursor-pointer"
                  onClick={() => setSelected(isSelected ? "" : r.roadmapName)}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate">{name}</h3>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      {r.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {r.duration}
                        </span>
                      )}
                      <span>· {rowSkills.length} skills</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 ml-4">
                    <div className="hidden sm:block w-40">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{rowProgress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-background overflow-hidden">
                        <div
                          className="h-full bg-gradient-brand shadow-sm transition-all duration-500"
                          style={{ width: `${rowProgress}%` }}
                        />
                      </div>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ${isSelected ? "rotate-90" : ""}`}
                    />
                  </div>
                </div>

                {/* EXPANDED CONTENT */}
                {isSelected && (
                  <div className="px-5 pb-5 pt-0" onClick={(e) => e.stopPropagation()}>
                    <div className="border-t border-border pt-5 animate-fade-in-up">
                      
                      {/* PLAN META */}
                      {plan && (
                        <div className="mb-4 rounded-xl border border-border bg-surface/40 p-3 text-xs text-muted-foreground space-y-1">
                          <div className="flex flex-wrap gap-3">
                            <span>Level: <span className="text-foreground font-medium">{plan.level}</span></span>
                            <span>Pace: <span className="text-foreground font-medium">{plan.pace?.pace || "new"}</span></span>
                            <span>Weekly target: <span className="text-foreground font-medium">{plan.weeklyTarget}</span></span>
                          </div>
                          {plan.nextFocus?.length > 0 && (
                            <div>Next focus: <span className="text-primary">{plan.nextFocus.join(", ")}</span></div>
                          )}
                        </div>
                      )}

                      {/* LOADING / ERROR */}
                      {loading && (
                        <p className="text-sm text-muted-foreground py-2">Loading your roadmap…</p>
                      )}
                      {error && (
                        <p className="text-sm text-red-400 py-2">{error}</p>
                      )}

                      {/* SKILL CHECKBOXES */}
                      {!loading && skillOrder.length > 0 && (
                        <div className="space-y-2">
                          {skillOrder.map((skill, i) => (
                            <div
                              key={skill}
                              className="flex items-center gap-3 text-sm"
                              onClick={() => toggleSkill(skill)}
                            >
                              <div className={`h-6 w-6 rounded-full grid place-items-center text-[11px] cursor-pointer transition-all ${
                                checked[skill]
                                  ? "bg-gradient-brand text-primary-foreground"
                                  : "border border-border text-muted-foreground hover:border-primary"
                              }`}>
                                {i + 1}
                              </div>
                              <span className={checked[skill] ? "text-muted-foreground line-through" : ""}>
                                {skill}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* PROGRESS SUMMARY */}
                      {!loading && selected && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{completed} / {total} completed</span>
                          <span>·</span>
                          <span className="text-primary font-medium">{progress}%</span>
                        </div>
                      )}

                      {/* STATS CHART */}
                      {chartData.length > 0 && (
                        <div className="mt-5">
                          <div className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Weekly activity</div>
                          <ResponsiveContainer width="100%" height={180}>
                            <LineChart data={chartData}>
                              <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" />
                              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                              <Tooltip
                                contentStyle={{
                                  background: "var(--surface)",
                                  border: "1px solid var(--border)",
                                  borderRadius: "8px",
                                  fontSize: "12px",
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke="var(--primary)"
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {/* AI INSIGHT */}
                      {insight && (
                        <div className="mt-4 rounded-xl border border-primary/40 bg-surface/40 p-3">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
                            <Sparkles className="h-3.5 w-3.5" /> AI Insight
                          </div>
                          <p className="text-xs text-muted-foreground">{insight}</p>
                        </div>
                      )}

                      {/* RECOMMENDED PROJECTS */}
                      {projects.length > 0 && (
                        <div className="mt-4">
                          <div className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Recommended projects</div>
                          <div className="flex flex-wrap gap-1.5">
                            {projects.map((p, i) => (
                              <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-surface-elevated text-muted-foreground border border-border">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* SKILL TEST POPUP */}
      {showTestPopup && (
        <div className="fixed inset-0 z-50 grid place-items-center p-6 bg-background/70 backdrop-blur-sm animate-fade-in-up">
          <div className="card-glow rounded-3xl max-w-md w-full p-8 relative overflow-hidden">
            <button
              onClick={() => setShowTestPopup(false)}
              className="absolute top-4 right-4 h-8 w-8 grid place-items-center rounded-full hover:bg-surface-elevated"
            >
              <X className="h-4 w-4" />
            </button>
            <div
              className="absolute -top-20 -right-20 h-60 w-60 rounded-full opacity-30"
            />
            <div className="relative text-center">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-brand grid place-items-center shadow-sm">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">Take the skill assessment first</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                SkillSnap needs to understand your level before personalizing your roadmap.
              </p>
              <div className="mt-6 flex gap-2 justify-center">
                <button
                  onClick={() => setShowTestPopup(false)}
                  className="px-4 py-2 rounded-md border border-border text-sm hover:bg-surface-elevated"
                >
                  Maybe later
                </button>
                <button
                  onClick={() => { setShowTestPopup(false); navigate("/test"); }}
                  className="px-4 py-2 rounded-md bg-gradient-brand text-primary-foreground text-sm font-medium"
                >
                  Start assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
