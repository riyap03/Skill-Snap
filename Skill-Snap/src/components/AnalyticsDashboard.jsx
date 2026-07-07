import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Flame,
  Loader2,
  Target,
  TrendingUp,
} from "lucide-react";
import { apiUrl } from "../config/api";

const clampPercent = (value) => Math.max(0, Math.min(100, Math.round(Number(value) || 0)));

const titleCase = (value = "") =>
  value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2 shadow-lg">
      {label && <div className="mb-1 text-xs text-muted-foreground">{label}</div>}
      {payload.map((item) => (
        <div key={item.dataKey} className="flex items-center justify-between gap-5 text-xs">
          <span className="text-muted-foreground">{item.name}</span>
          <span className="font-semibold text-foreground">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, detail, tone = "blue" }) => {
  const tones = {
    blue: "bg-blue-500/15 text-blue-300",
    green: "bg-emerald-500/15 text-emerald-300",
    purple: "bg-violet-500/15 text-violet-300",
    amber: "bg-amber-500/15 text-amber-300",
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="mt-2 text-2xl font-display font-bold">{value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone] || tones.blue}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [skills, setSkills] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setError("");
        const token = localStorage.getItem("token");
        const headers = { headers: { Authorization: `Bearer ${token}` } };
        const [overviewRes, skillsRes, roadmapRes, assessmentsRes] = await Promise.all([
          axios.get(apiUrl("/api/analytics/overview"), headers),
          axios.get(apiUrl("/api/analytics/skills"), headers),
          axios.get(apiUrl("/api/analytics/roadmap"), headers),
          axios.get(apiUrl("/api/analytics/assessments"), headers),
        ]);
        setAnalytics(overviewRes.data.overview || {});
        setSkills(skillsRes.data.skills || []);
        setRoadmaps(roadmapRes.data.roadmaps || []);
        setAssessments(assessmentsRes.data.assessments || []);
      } catch {
        setError("Analytics could not be loaded. Please make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const completedSkills = analytics?.completedSkills || 0;
  const totalSkills = analytics?.totalSkills || 0;
  const completionPercent = totalSkills ? clampPercent((completedSkills / totalSkills) * 100) : 0;
  const accuracyScore = clampPercent(analytics?.accuracyScore);
  const recentAssessments = assessments.slice(-8);
  const averageAssessment = recentAssessments.length
    ? clampPercent(recentAssessments.reduce((sum, item) => sum + (item.accuracy || 0), 0) / recentAssessments.length)
    : 0;

  const skillChart = useMemo(() => {
    let running = 0;
    return skills.slice(-14).map((item) => {
      running += Number(item.completed) || 0;
      return { ...item, cumulative: running };
    });
  }, [skills]);

  const roadmapChart = roadmaps
    .slice()
    .sort((a, b) => (b.progress || 0) - (a.progress || 0))
    .slice(0, 6)
    .map((item) => ({
      ...item,
      name: titleCase(item.name),
      progress: clampPercent(item.progress),
    }));

  const pieData = [
    { name: "Completed", value: completedSkills },
    { name: "Remaining", value: Math.max(0, totalSkills - completedSkills) },
  ];

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          Loading analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
              <BarChart3 className="h-3.5 w-3.5 text-primary" />
              Learning analytics
            </div>
            <h1 className="mt-4 text-3xl font-display font-bold tracking-tight sm:text-4xl">
              Progress that actually moves
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Skill completion, roadmap pace, and assessment accuracy in one focused view.
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/roadmap" className="rounded-xl border border-border px-4 py-2.5 text-sm hover:bg-surface-elevated">
              Roadmaps
            </Link>
            <Link to="/assessment" className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm text-primary-foreground">
              Practice <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Target} label="Overall Progress" value={`${completionPercent}%`} detail={`${completedSkills} of ${totalSkills} skills`} tone="blue" />
          <StatCard icon={ClipboardCheck} label="Assessment Accuracy" value={`${accuracyScore}%`} detail={`${analytics?.assessmentCount || 0} assessments saved`} tone="purple" />
          <StatCard icon={Flame} label="Learning Streak" value={`${analytics?.streak || 0} days`} detail="Based on recent activity" tone="amber" />
          <StatCard icon={Clock} label="Study Time" value={`${analytics?.weeklyHours || 0}h`} detail={`${analytics?.monthlyHours || 0}h this month`} tone="green" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="rounded-2xl border border-border bg-surface p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Skill Momentum</h2>
                <p className="text-xs text-muted-foreground">Cumulative skills completed from roadmap activity.</p>
              </div>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            {skillChart.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={skillChart}>
                  <defs>
                    <linearGradient id="skillMomentum" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="cumulative" name="Skills" stroke="#3b82f6" strokeWidth={2} fill="url(#skillMomentum)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={BookOpen} text="Complete roadmap skills to build your momentum chart." to="/roadmap" label="Open roadmaps" />
            )}
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5">
            <div className="mb-5">
              <h2 className="text-lg font-semibold">Completion Mix</h2>
              <p className="text-xs text-muted-foreground">Completed vs remaining skills.</p>
            </div>
            {totalSkills ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" innerRadius={62} outerRadius={88} paddingAngle={3} stroke="none">
                      <Cell fill="#3b82f6" />
                      <Cell fill="rgba(255,255,255,0.1)" />
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center">
                  <div className="text-3xl font-display font-bold">{completionPercent}%</div>
                  <div className="text-xs text-muted-foreground">complete</div>
                </div>
              </>
            ) : (
              <EmptyState icon={Target} text="Start a roadmap to unlock completion tracking." to="/roadmap" label="Choose a roadmap" />
            )}
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-surface p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Roadmap Progress</h2>
                <p className="text-xs text-muted-foreground">Your most active paths.</p>
              </div>
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            {roadmapChart.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={roadmapChart} layout="vertical" margin={{ left: 20, right: 12 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="progress" name="Progress %" fill="#06b6d4" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={BookOpen} text="No roadmap progress yet." to="/roadmap" label="Start learning" />
            )}
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Assessment Trend</h2>
                <p className="text-xs text-muted-foreground">Recent accuracy average: {averageAssessment}%.</p>
              </div>
              <ClipboardCheck className="h-5 w-5 text-primary" />
            </div>
            {recentAssessments.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={recentAssessments}>
                  <defs>
                    <linearGradient id="assessmentTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#8b5cf6" strokeWidth={2} fill="url(#assessmentTrend)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={ClipboardCheck} text="Take an assessment to see accuracy trends." to="/assessment" label="Take assessment" />
            )}
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <p className="text-xs text-muted-foreground">Latest assessment and roadmap updates.</p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[...recentAssessments.slice(-4).reverse(), ...roadmapChart.slice(0, 4)].slice(0, 8).map((item, index) => {
              const isAssessment = item.type;
              const percent = clampPercent(isAssessment ? item.accuracy : item.progress);
              return (
                <div key={`${isAssessment ? "assessment" : "roadmap"}-${index}`} className="rounded-xl border border-border bg-background/40 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">{isAssessment ? titleCase(item.type) : "Roadmap"}</span>
                    <span className="text-xs font-semibold">{percent}%</span>
                  </div>
                  <div className="truncate text-sm font-medium">{isAssessment ? item.date : item.name}</div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-elevated">
                    <div className="h-full rounded-full bg-gradient-brand" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function EmptyState({ icon: Icon, text, to, label }) {
  return (
    <div className="grid min-h-52 place-items-center rounded-xl border border-dashed border-border bg-background/30 p-6 text-center">
      <div>
        <Icon className="mx-auto h-7 w-7 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">{text}</p>
        <Link to={to} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs hover:bg-surface-elevated">
          {label} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
