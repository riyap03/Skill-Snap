import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../config/api";
import { CheckCircle2, ArrowRight, Trophy } from "lucide-react";

export default function AssessmentResult() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(apiUrl("/api/assessment/results"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResult(res.data);
} catch {
         setError("Failed to load results.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading results…</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <h2 className="font-display text-2xl font-semibold">No results yet</h2>
        <p className="text-sm text-muted-foreground">Take some assessments to see your results here.</p>
        <Link to="/assessment" className="text-sm text-primary hover:opacity-80">
          Take an assessment →
        </Link>
      </div>
    );
  }

  const { assessmentResults, learningProfile } = result;
  const ar = assessmentResults || {};

  const tracks = [
    { key: "frontend", label: "Frontend", score: ar.frontendScore || 0 },
    { key: "backend", label: "Backend", score: ar.backendScore || 0 },
    { key: "dsa", label: "DSA", score: ar.dsaScore || 0 },
    { key: "ai_ml", label: "AI/ML", score: ar.aiMlScore || 0 },
  ];

  const overallScore = tracks.reduce((a, t) => a + t.score, 0) / tracks.length;

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-center mb-10">
          <Trophy className="mx-auto h-12 w-12 text-primary mb-3" />
          <h1 className="text-3xl font-display font-bold tracking-tight">Your Assessment Results</h1>
          <p className="text-sm text-muted-foreground mt-1">Based on your performance across all tracks</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card-glow rounded-2xl p-5 text-center">
            <div className="text-xs text-muted-foreground">Overall Score</div>
            <div className="mt-2 text-3xl font-display font-bold text-gradient">{overallScore.toFixed(0)}%</div>
          </div>
          <div className="card-glow rounded-2xl p-5 text-center">
            <div className="text-xs text-muted-foreground">Level</div>
            <div className="mt-2 text-lg font-display font-bold">{learningProfile?.level || ar.level || "Beginner"}</div>
          </div>
          <div className="card-glow rounded-2xl p-5 text-center">
            <div className="text-xs text-muted-foreground">Tracks Taken</div>
            <div className="mt-2 text-lg font-display font-bold">{tracks.filter((t) => t.score > 0).length}/4</div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {tracks.map((t) => (
            <div key={t.key} className="card-glow rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t.label}</span>
                <span className={`text-lg font-display font-bold ${t.score >= 70 ? "text-green-400" : t.score >= 40 ? "text-yellow-400" : "text-red-400"}`}>
                  {t.score}%
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-surface-elevated overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${t.score >= 70 ? "bg-green-500" : t.score >= 40 ? "bg-yellow-500" : "bg-red-500"}`}
                  style={{ width: `${t.score}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                {t.score >= 70 ? "Strong performance" : t.score >= 40 ? "Good progress" : t.score > 0 ? "Needs practice" : "Not taken yet"}
              </p>
            </div>
          ))}
        </div>

        {ar.weakSkills?.length > 0 && (
          <div className="card-glow rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-semibold mb-2">Skills to improve</h3>
            <div className="flex flex-wrap gap-2">
              {ar.weakSkills.slice(0, 8).map((s, i) => (
                <span key={i} className="text-xs px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300">{s}</span>
              ))}
            </div>
          </div>
        )}
        {ar.strongSkills?.length > 0 && (
          <div className="card-glow rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-semibold mb-2">Your strengths</h3>
            <div className="flex flex-wrap gap-2">
              {ar.strongSkills.slice(0, 8).map((s, i) => (
                <span key={i} className="text-xs px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-300">{s}</span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center gap-3">
          <Link to="/assessment" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-gray-200 text-sm hover:bg-surface-elevated">
            Take more assessments
          </Link>
          <Link to="/roadmap" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gradient-brand text-primary-foreground text-sm font-medium">
            View personalized roadmap <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
