import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../config/api";
import { MessageSquare, Send, Sparkles, Zap, Briefcase, FileText, Target, ArrowRight, Loader2 } from "lucide-react";

const ACTIONS = {
  skills: "Suggest Skills",
  projects: "Suggest Projects",
  portfolio: "Portfolio Review",
  readiness: "Job Readiness",
};

export default function CareerCoach() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your AI career coach. I can help with skill suggestions, project ideas, portfolio feedback, and job readiness. How can I help?" },
  ]);
  const [actionLoading, setActionLoading] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAction = async (actionKey) => {
    setActionLoading(actionKey);
    try {
      const token = localStorage.getItem("token");
      let result;
      switch (actionKey) {
        case "skills":
          result = await axios.get(apiUrl("/api/coach/suggest-skills"), { headers: { Authorization: `Bearer ${token}` } });
          setMessages((prev) => [...prev, { role: "assistant", text: `Based on your profile, here are the skills you should learn next:\n\n${result.data.suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\nTarget role: ${result.data.basedOn.targetRole} | Level: ${result.data.basedOn.level}` }]);
          break;
        case "projects":
          result = await axios.get(apiUrl("/api/coach/suggest-projects"), { headers: { Authorization: `Bearer ${token}` } });
          setMessages((prev) => [...prev, { role: "assistant", text: `${result.data.recommendationNote}\n\nSuggested projects:\n${result.data.suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n")}` }]);
          break;
        case "portfolio":
          result = await axios.get(apiUrl("/api/coach/portfolio-feedback"), { headers: { Authorization: `Bearer ${token}` } });
          setMessages((prev) => [...prev, { role: "assistant", text: `${result.data.summary}\n\nDetailed feedback:\n${result.data.feedback.map((f, i) => `${i + 1}. [${f.type}] ${f.message}`).join("\n")}` }]);
          break;
        case "readiness":
          result = await axios.get(apiUrl("/api/coach/job-readiness"), { headers: { Authorization: `Bearer ${token}` } });
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              text: `Your job readiness score: ${result.data.overallScore}%\n\nBreakdown: Skills ${result.data.skillScore}% | Portfolio ${result.data.portfolioScore}% | Assessments ${result.data.assessmentScore}% | Projects ${result.data.projectScore}%\n\nStrengths: ${result.data.strengths.join(", ") || "Building up"}\nWeaknesses: ${result.data.weaknesses.join(", ") || "None identified"}\n\nNext steps:\n${result.data.improvements.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
            },
          ]);
          break;
      }
} catch {
       setMessages((prev) => [...prev, { role: "assistant", text: "Sorry, I couldn't process that. Please try again." }]);
    } finally {
      setActionLoading(null);
    }
  };

  const sendMessage = async () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Great question! In the full version, I'll analyze your profile, learning style, and progress to provide personalized guidance. For now, use the quick actions above for specific guidance.",
        },
      ]);
    }, 800);
  };

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-display font-bold">AI Career Coach</h1>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <button onClick={() => handleAction("skills")} disabled={!!actionLoading} className="card-glow rounded-xl p-4 text-left hover:border-primary/60 disabled:opacity-50">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-primary" /> Suggest Skills
            </div>
            <p className="text-xs text-muted-foreground mt-1">Get personalized skill recommendations</p>
          </button>
          <button onClick={() => handleAction("projects")} disabled={!!actionLoading} className="card-glow rounded-xl p-4 text-left hover:border-primary/60 disabled:opacity-50">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Briefcase className="h-4 w-4 text-primary" /> Suggest Projects
            </div>
            <p className="text-xs text-muted-foreground mt-1">Projects matched to your level and role</p>
          </button>
          <button onClick={() => handleAction("portfolio")} disabled={!!actionLoading} className="card-glow rounded-xl p-4 text-left hover:border-primary/60 disabled:opacity-50">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-primary" /> Portfolio Review
            </div>
            <p className="text-xs text-muted-foreground mt-1">Get feedback on your portfolio</p>
          </button>
          <button onClick={() => handleAction("readiness")} disabled={!!actionLoading} className="card-glow rounded-xl p-4 text-left hover:border-primary/60 disabled:opacity-50">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Target className="h-4 w-4 text-primary" /> Job Readiness
            </div>
            <p className="text-xs text-muted-foreground mt-1">Check your job readiness score</p>
          </button>
        </div>

        {actionLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Loader2 className="h-4 w-4 animate-spin" /> Analyzing your profile…
          </div>
        )}

        {/* Chat */}
        <div className="card-glow rounded-2xl overflow-hidden">
          <div className="h-[400px] overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                    m.role === "user" ? "bg-gradient-brand text-primary-foreground rounded-br-sm" : "bg-surface/60 border border-border rounded-bl-sm"
                  }`}
                >
                  {m.role === "assistant" && <Sparkles className="h-3 w-3 text-primary inline mr-1" />}
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border p-3 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about skills, projects, career advice…"
              className="flex-1 h-10 px-3 rounded-md bg-surface/60 border border-border outline-none focus:border-primary text-sm"
            />
            <button onClick={sendMessage} className="h-10 w-10 grid place-items-center rounded-md bg-gradient-brand text-primary-foreground shrink-0">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
