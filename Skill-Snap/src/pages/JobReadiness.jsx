import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../config/api";
import { Loader2, AlertTriangle, CheckCircle2, TrendingUp, Target, Briefcase, GraduationCap } from "lucide-react";

export default function JobReadiness() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReadiness = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(apiUrl("/api/coach/job-readiness"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch {
      setError("Failed to load job readiness data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadiness();
  }, []);

  const getScoreColor = (s) => {
    if (s >= 70) return "text-green-400 bg-green-500/10 border-green-500/30";
    if (s >= 40) return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
    return "text-red-400 bg-red-500/10 border-red-500/30";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <AlertTriangle className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{error}</p>
        <button onClick={fetchReadiness} className="text-sm text-primary">Try again</button>
      </div>
    );
  }

  const scores = [
    { label: "Skills", score: data.skillScore, icon: Target },
    { label: "Portfolio", score: data.portfolioScore, icon: Briefcase },
    { label: "Assessments", score: data.assessmentScore, icon: GraduationCap },
    { label: "Projects", score: data.projectScore, icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-display font-bold tracking-tight mb-2">Job Readiness</h1>
        <p className="text-sm text-muted-foreground mb-8">Your overall readiness percentage and personalized improvement roadmap.</p>

        {/* Overall score */}
        <div className="card-glow rounded-3xl p-8 text-center mb-8">
          <div className="inline-flex items-center justify-center h-32 w-32 rounded-full border-4 bg-surface-elevated mb-4">
            <div className="text-center">
              <div className={`text-3xl font-display font-bold ${getScoreColor(data.overallScore).split(" ")[0]}`}>
                {data.overallScore}%
              </div>
              <div className="text-[10px] text-muted-foreground">Ready</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">Level: <span className="text-foreground font-medium">{data.level || "Beginner"}</span></div>
        </div>

        {/* Score breakdown */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {scores.map((s) => (
            <div key={s.label} className="card-glow rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{s.label}</span>
                <s.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="h-2 rounded-full bg-surface-elevated overflow-hidden mb-1.5">
                <div className={`h-full rounded-full transition-all ${s.score >= 70 ? "bg-green-500" : s.score >= 40 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${s.score}%` }} />
              </div>
              <div className={`text-right text-xs font-medium ${getScoreColor(s.score).split(" ")[0]}`}>{s.score}%</div>
            </div>
          ))}
        </div>

        {/* Strengths */}
        {data.strengths?.length > 0 && (
          <div className="card-glow rounded-2xl p-5 mb-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-400" /> Strengths
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.strengths.map((s, i) => (
                <span key={i} className="text-xs px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-300">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Weaknesses */}
        {data.weaknesses?.length > 0 && (
          <div className="card-glow rounded-2xl p-5 mb-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" /> Areas to improve
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.weaknesses.map((s, i) => (
                <span key={i} className="text-xs px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Action items */}
        {data.improvements?.length > 0 && (
          <div className="card-glow rounded-2xl p-5 mb-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" /> Your improvement roadmap
            </h3>
            <ol className="space-y-2">
              {data.improvements.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="h-5 w-5 rounded-full bg-primary/20 text-primary grid place-items-center text-[10px] shrink-0 mt-0.5">{i + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="flex justify-center gap-3">
          <button onClick={fetchReadiness} className="px-5 py-2.5 rounded-md border border-border text-sm hover:bg-surface-elevated">Refresh</button>
        </div>
      </main>
    </div>
  );
}
