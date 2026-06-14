import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";
import { apiUrl } from "../config/api";
import {
  Flame,
  TrendingUp,
  Trophy,
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Code2,
  Target,
  Zap,
  Brain,
} from "lucide-react";

const COLORS = {
  purple: "#a855f7",
  pink: "#ec4899",
  blue: "#3b82f6",
  cyan: "#06b6d4",
  green: "#22c55e",
  yellow: "#eab308",
  orange: "#f97316",
  red: "#ef4444",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-surface-elevated px-4 py-3 shadow-2xl backdrop-blur-xl">
      {label && <p className="text-xs text-muted-foreground mb-2">{label}</p>}
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">{entry.name}</span>
          <span className="text-sm font-semibold" style={{ color: entry.color }}>
            {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const StatCard = ({ icon: IconComponent, label, value, sub, gradient }) => (
  <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-all hover:border-border hover:shadow-lg hover:shadow-brand-purple/10">
    <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-2xl`} />
    <div className="relative">
      <div className="flex items-center gap-2 mb-3">
        <div className={`rounded-lg bg-gradient-to-br ${gradient} p-2`}>
          <IconComponent className="h-4 w-4 text-foreground" />
        </div>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="text-3xl font-display font-bold tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{sub}</div>
    </div>
  </div>
);

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [skills, setSkills] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { headers: { Authorization: `Bearer ${token}` } };
        const [overviewRes, skillsRes, roadmapRes, assessmentsRes] = await Promise.all([
          axios.get(apiUrl("/api/analytics/overview"), headers),
          axios.get(apiUrl("/api/analytics/skills"), headers),
          axios.get(apiUrl("/api/analytics/roadmap"), headers),
          axios.get(apiUrl("/api/analytics/assessments"), headers),
        ]);
        setAnalytics(overviewRes.data.overview);
        setSkills(skillsRes.data.skills || []);
        setRoadmaps(roadmapRes.data.roadmaps || []);
        setAssessments(assessmentsRes.data.assessments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-brand-purple animate-spin" />
          <p className="text-sm text-muted-foreground">Loading analytics…</p>
        </div>
      </div>
    );
  }

  if (!loading && !analytics) {
    return (
      <div className="min-h-screen">
        <main className="mx-auto max-w-4xl px-6 py-12">
          <div className="text-center mb-12">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-brand grid place-items-center shadow-sm mb-6">
              <Brain className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight mb-3">Analytics</h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
              Start using SkillSnap to unlock personalized insights and progress tracking.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { to: "/roadmap", icon: BookOpen, title: "Start a roadmap", desc: "Pick a career path and start learning skills.", color: "from-blue-500 to-cyan-400" },
              { to: "/assessment", icon: ClipboardCheck, title: "Take an assessment", desc: "Complete a core track or adaptive test.", color: "from-purple-500 to-pink-400" },
              { to: "/assessment", icon: Code2, title: "Practice coding", desc: "Try a coding challenge to track speed and accuracy.", color: "from-orange-500 to-yellow-400" },
            ].map((item) => (
              <Link key={item.to} to={item.to} className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 text-left transition-all hover:border-border hover:shadow-lg hover:shadow-brand-purple/10">
                <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${item.color} opacity-20 blur-2xl transition-opacity group-hover:opacity-30`} />
                <div className="relative">
                  <div className={`inline-flex h-10 w-10 rounded-xl bg-gradient-to-br ${item.color} grid place-items-center mb-4 shadow-lg`}>
                    <item.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="text-base font-semibold mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-primary mt-3 group-hover:gap-2 transition-all">
                    Get started <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const skillDistribution = [
    { name: "Completed", value: analytics.completedSkills || 0 },
    { name: "Remaining", value: Math.max(0, (analytics.totalSkills || 0) - (analytics.completedSkills || 0)) },
  ].filter((item) => item.value > 0 || item.name === "Remaining");

  const pieData = skillDistribution.length > 0 ? skillDistribution : [{ name: "No data", value: 1 }];

  const chartData = skills.slice(-12);
  const roadmapData = roadmaps.slice(-6);
  const assessmentData = assessments.slice(-8);
  const recentTrend = assessmentData.length >= 2
    ? assessmentData[assessmentData.length - 1]?.accuracy - assessmentData[0]?.accuracy
    : 0;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Flame}
          label="Learning Streak"
          value={`${analytics.streak || 0} days`}
          sub={analytics.streak >= 7 ? "On fire!" : "Keep it going"}
          gradient="from-orange-500 to-red-500"
        />
        <StatCard
          icon={Target}
          label="Skills Completed"
          value={analytics.completedSkills || 0}
          sub={`of ${analytics.totalSkills || 0} total`}
          gradient="from-blue-500 to-cyan-400"
        />
        <StatCard
          icon={Trophy}
          label="Assessments"
          value={analytics.assessmentCount || 0}
          sub="tests completed"
          gradient="from-purple-500 to-pink-400"
        />
        <StatCard
          icon={Zap}
          label="This Week"
          value={`${analytics.weeklyHours || 0}h`}
          sub={`${analytics.monthlyHours || 0}h this month`}
          gradient="from-emerald-500 to-teal-400"
        />
      </div>

      {/* Performance Summary Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-brand-purple/20 via-brand-pink/20 to-blue-500/20 p-6">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-display font-bold">Performance Overview</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Level: <span className="text-primary font-medium capitalize">{analytics.level || "beginner"}</span> ·
              Accuracy: <span className="text-primary font-medium">{analytics.accuracyScore || 0}%</span> ·
              Speed: <span className="text-cyan-400 font-medium">{analytics.speedScore || 0}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${recentTrend >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
              <TrendingUp className="h-3 w-3" />
              {recentTrend >= 0 ? "+" : ""}{recentTrend}% trend
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Skill Growth - takes 2 columns */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Skill Growth Over Time</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Cumulative skills completed</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-medium">
              <TrendingUp className="h-3 w-3" />
              {chartData.length > 0 && chartData[chartData.length - 1]?.completed || 0} total
            </div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="skillGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={COLORS.purple} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="skillLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={COLORS.purple} />
                    <stop offset="100%" stopColor={COLORS.pink} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  dy={8}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  dx={-8}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1e293b",
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "#f8fafc",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                  }}
                  labelStyle={{ color: "#64748b", marginBottom: 4 }}
                  formatter={(value) => [<span className="font-semibold text-primary">{value} skills</span>, "Completed"]}
                />
                <Area
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationEasing="ease-out"
                  type="monotone"
                  dataKey="completed"
                  stroke="url(#skillLine)"
                  strokeWidth={3}
                  fill="url(#skillGrad)"
                  dot={{ r: 4, fill: COLORS.purple, strokeWidth: 2, stroke: "#0f0f1a" }}
                  activeDot={{ r: 6, fill: COLORS.pink, strokeWidth: 2, stroke: "#0f0f1a" }}
                  name="Completed"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="h-12 w-12 rounded-full bg-surface-elevated flex items-center justify-center mb-3">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Complete more skills to see growth charts</p>
            </div>
          )}
        </div>

        {/* Skill Distribution Donut */}
        <div className="rounded-2xl border border-border bg-surface p-5 animate-fade-in-up animate-delay-200">
          <h3 className="text-sm font-semibold text-foreground mb-1">Skill Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">Progress breakdown</p>
          {analytics.totalSkills > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <defs>
                    <linearGradient id="donutPurple" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={COLORS.purple} />
                      <stop offset="100%" stopColor={COLORS.pink} />
                    </linearGradient>
                    <linearGradient id="donutGray" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="rgba(0,0,0,0.1)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.05)" />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={index === 0 ? "url(#donutPurple)" : "url(#donutGray)"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#1e293b",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "#f8fafc",
                    }}
                    formatter={(value) => [<span className="font-semibold">{value}</span>, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gradient-to-br from-brand-purple to-brand-pink" />
                  <span className="text-xs text-muted-foreground">Done</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-surface-elevated" />
                  <span className="text-xs text-muted-foreground">Remaining</span>
                </div>
              </div>
              <div className="mt-3 text-center">
                <div className="text-2xl font-display font-bold text-foreground">
                  {Math.round((analytics.completedSkills / Math.max(1, analytics.totalSkills)) * 100)}%
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Complete</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-12 w-12 rounded-full bg-surface-elevated flex items-center justify-center mb-3">
                <Target className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Start a roadmap to track progress</p>
            </div>
          )}
        </div>
      </div>

      {/* Roadmap & Assessment Charts */}
      <div className="grid lg:grid-cols-2 gap-6 animate-fade-in-up animate-delay-100">
        {/* Roadmap Completion */}
        <div className="rounded-2xl border border-border bg-surface p-5 animate-fade-in-up animate-delay-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Roadmap Progress</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Completion by roadmap</p>
            </div>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </div>
          {roadmapData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={roadmapData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="roadmapLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={COLORS.blue} />
                    <stop offset="100%" stopColor={COLORS.cyan} />
                  </linearGradient>
                  <linearGradient id="roadmapArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={COLORS.blue} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 9, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  dy={8}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  dx={-8}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1e293b",
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "#f8fafc",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                  }}
                  formatter={(value) => [<span className="font-semibold text-primary">{value}%</span>, "Progress"]}
                />
                <Area
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationEasing="ease-out"
                  type="monotone"
                  dataKey="progress"
                  stroke="url(#roadmapLine)"
                  strokeWidth={3}
                  fill="url(#roadmapArea)"
                  dot={{ r: 4, fill: COLORS.blue, strokeWidth: 2, stroke: "#0f0f1a" }}
                  activeDot={{ r: 6, fill: COLORS.cyan, strokeWidth: 2, stroke: "#0f0f1a" }}
                  name="Progress %"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="h-12 w-12 rounded-full bg-surface-elevated flex items-center justify-center mb-3">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Start a roadmap to see progress</p>
            </div>
          )}
        </div>

        {/* Assessment Scores */}
        <div className="rounded-2xl border border-border bg-surface p-5 animate-fade-in-up animate-delay-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Assessment Scores</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Accuracy over time</p>
            </div>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </div>
          {assessmentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={assessmentData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={COLORS.pink} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  dy={8}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  dx={-8}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1e293b",
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "#f8fafc",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                  }}
                  formatter={(value) => [<span className="font-semibold text-primary">{value}%</span>, "Accuracy"]}
                />
                <Line
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationEasing="ease-out"
                  type="monotone"
                  dataKey="accuracy"
                  stroke={COLORS.pink}
                  strokeWidth={3}
                  dot={{ r: 4, fill: COLORS.pink, strokeWidth: 2, stroke: "#0f0f1a" }}
                  activeDot={{ r: 6, fill: "#fff", strokeWidth: 2, stroke: COLORS.pink }}
                  name="Accuracy %"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="h-12 w-12 rounded-full bg-surface-elevated flex items-center justify-center mb-3">
                <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Take assessments to see score trends</p>
            </div>
          )}
        </div>
      </div>

      {/* Activity Heatmap-style Cards */}
      <div className="rounded-2xl border border-border bg-surface p-5 animate-fade-in-up animate-delay-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Latest assessments and progress</p>
          </div>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </div>
        {assessments.length > 0 || roadmaps.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[...assessments.slice(-4).reverse(), ...roadmaps.slice(-2).reverse()].map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-surface p-4 transition-all hover:border-border hover:bg-surface-elevated"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.type === "assessment" ? "bg-primary/20 text-primary" : "bg-brand-pink/20 text-primary"}`}>
                    {item.type === "assessment" ? "Assessment" : "Roadmap"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {(() => {
                      const d = item.date || item.createdAt;
                      if (!d) return "Unknown";
                      const parsed = new Date(d);
                      if (Number.isNaN(parsed.getTime())) return "Unknown";
                      return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                    })()}
                  </span>
                </div>
                <div className="text-sm font-medium text-foreground mb-1">
                  {item.type === "assessment" ? `${item.accuracy}% accuracy` : `${item.progress || 0}% complete`}
                </div>
                <div className="h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-pink transition-all"
                    style={{ width: `${item.type === "assessment" ? item.accuracy : item.progress || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-12 w-12 rounded-full bg-surface-elevated flex items-center justify-center mb-3">
              <Flame className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">No activity yet. Start learning to see insights</p>
          </div>
        )}
      </div>
    </div>
  );
}
