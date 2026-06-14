import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../config/api";

export default function AssessmentWizard() {
  const [step, setStep] = useState("select");
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const trackMeta = {
    frontend: "Frontend Development",
    backend: "Backend Development",
    dsa: "Data Structures & Algorithms",
    ai_ml: "AI & Machine Learning",
  };

  const startTrack = async (track) => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrl(`/api/assessment/questions?track=${track}`));
      setQuestions(res.data.questions || []);
      setSelectedTrack(track);
      setStep("test");
      setQIndex(0);
      setAnswers([]);
      setScore(0);
    } catch {
      alert("Failed to load questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (choiceIndex) => {
    const q = questions[qIndex];
    if (!q) return;
    const newAnswers = [...answers, choiceIndex];
    if (q.options[choiceIndex]?.correct) {
      setScore((s) => s + 1);
    }
    if (qIndex < questions.length - 1) {
      setQIndex((i) => i + 1);
    } else {
      setStep("result");
    }
    setAnswers(newAnswers);
  };

  const submit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        apiUrl("/api/assessment/submit"),
        {
          track: selectedTrack,
          correctAnswers: score,
          totalQuestions: questions.length,
          answers,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
      setStep("done");
    } catch {
      alert("Failed to submit.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "select") {
    return (
      <div className="grid sm:grid-cols-2 gap-4">
        {Object.entries(trackMeta).map(([key, label]) => (
          <button key={key} onClick={() => startTrack(key)} disabled={loading} className="card-glow rounded-2xl p-6 text-left hover:border-primary/60 disabled:opacity-50">
            <div className="text-sm font-semibold">{label}</div>
            <p className="text-xs text-muted-foreground mt-1">5 questions · ~3 min</p>
          </button>
        ))}
      </div>
    );
  }

  const q = questions[qIndex];

  return (
    <div>
      {step !== "done" && q && (
        <>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <span>Question {qIndex + 1}/{questions.length}</span>
            <span>{selectedTrack}</span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-elevated overflow-hidden mb-6">
            <div className="h-full bg-gradient-brand transition-all" style={{ width: `${Math.round(((qIndex + 1) / questions.length) * 100)}%` }} />
          </div>
          <div key={qIndex} className="card-glow rounded-2xl p-6 animate-fade-up mb-4">
            <h3 className="text-lg font-semibold mb-4">{q.question}</h3>
            <div className="space-y-2">
              {q.options.map((opt, idx) => (
                <button key={idx} onClick={() => handleAnswer(idx)} className="w-full text-left p-4 rounded-xl border border-gray-200 bg-surface/60 hover:border-primary hover:bg-surface-elevated transition">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-md border border-gray-200 text-xs mr-3">{String.fromCharCode(65 + idx)}</span>
                  <span className="text-sm">{opt.text}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {step === "result" && (
        <div className="text-center py-8">
          <h3 className="text-xl font-display font-bold mb-2">Assessment Complete</h3>
          <p className="text-sm text-muted-foreground mb-4">Score: {score}/{questions.length} · Level: {score >= 4 ? "Advanced" : score >= 3 ? "Intermediate" : "Beginner"}</p>
          {!result && (
            <button onClick={submit} disabled={loading} className="px-6 py-2.5 rounded-md bg-gradient-brand text-primary-foreground text-sm font-medium disabled:opacity-60">
              {loading ? "Submitting…" : "Submit Result"}
            </button>
          )}
        </div>
      )}

      {step === "done" && result && (
        <div className="text-center py-8">
          <h3 className="text-xl font-display font-bold mb-1">Result Saved</h3>
          <p className="text-sm text-muted-foreground mb-4">Track: {trackMeta[result.track]} · Level: {result.level} · Score: {result.accuracy}%</p>
          <Link to="/test" className="inline-flex items-center gap-1 text-sm text-primary">Take another track →</Link>
        </div>
      )}
    </div>
  );
}
