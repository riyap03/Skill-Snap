import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";
import axios from "axios";
import { apiUrl } from "../config/api";
import { Flame, TrendingUp, Trophy } from "lucide-react";

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
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">Loading analytics…</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12 text-sm text-muted-foreground">
        Complete activities to see your analytics.
      </div>
    );
  }

  const customTooltipStyle = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    fontSize: "12px",
    color: "var(--foreground)",
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Flame, label: "Learning Streak", value: `${analytics.streak || 0} days`, sub: analytics.streak >= 7 ? "On fire!" : "Keep it going" },
          { icon: TrendingUp, label: "Skills Completed", value: analytics.completedSkills || 0, sub: `of ${analytics.totalSkills || 0} total` },
          { icon: Trophy, label: "Assessments", value: analytics.assessmentCount || 0, sub: "tests completed" },
          { icon: TrendingUp, label: "This Week", value: `${analytics.weeklyHours || 0}h`, sub: `${analytics.monthlyHours || 0}h this month` },
        ].map((s) => (
          <div key={s.label} className="card-glow rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="h-4 w-4 text-brand-pink" />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <div className="text-2xl font-display font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground opacity-60 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Skill Growth Chart */}
      <div className="card-glow rounded-2xl p-5">
        <h3 className="text-sm font-semibold mb-4">Skill Growth Over Time</h3>
        {skills.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={skills.slice(-10)}>
              <defs>
                <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--brand-purple)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--brand-purple)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Area type="monotone" dataKey="completed" stroke="var(--brand-purple)" fill="url(#analyticsGrad)" strokeWidth={2} name="Completed" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-xs text-muted-foreground py-4">Complete more skills to see growth charts.</p>
        )}
      </div>

      {/* Weekly Progress + Roadmap Comparison */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-glow rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-4">Roadmap Completion</h3>
          {roadmaps.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={roadmaps}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="progress" fill="var(--brand-purple)" name="Progress %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-muted-foreground py-4">Start a roadmap to see completion analytics.</p>
          )}
        </div>

        <div className="card-glow rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-4">Assessment Scores</h3>
          {assessments.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={assessments.slice(-6)}>
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} />
                <YAxis tick={{ fontSize: 9 }} domain={[0, 100]} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Line type="monotone" dataKey="accuracy" stroke="var(--brand-pink)" strokeWidth={2} dot={{ r: 3 }} name="Accuracy %" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-muted-foreground py-4">Take assessments to see score trends.</p>
          )}
        </div>
      </div>
    </div>
  );
}
