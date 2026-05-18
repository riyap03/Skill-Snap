import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {  useEffect } from "react";
import {
  Plus,
  ExternalLink,
  Calendar,
  Sparkles,
  Download,
  Github,
} from "lucide-react";
import { apiUrl } from "../config/api";
import jsPDF from "jspdf";

export default function Portfolio() {


useEffect(() => {
  fetchPortfolio();
}, []);
  const exportPDF = async () => {
    try {
      if (!aiContent.trim()) {
        alert("Please generate the AI portfolio first.");
        return;
      }

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 16;
      const maxLineWidth = pageWidth - margin * 2;
      const lineHeight = 7;
      let y = margin;

      const name = localStorage.getItem("name") || "Your Name";
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text(`${name} - AI Portfolio`, margin, y);
      y += 12;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);

      const lines = pdf.splitTextToSize(aiContent, maxLineWidth);

      lines.forEach((line) => {
        if (y > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }

        pdf.text(line, margin, y);
        y += lineHeight;
      });

      pdf.save(`${username}-ai-portfolio.pdf`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

 const [projects, setProjects] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    skills: "",
    date: "",
    link: "",
  });

  const [aiContent, setAiContent] = useState("");
  const [loading, setLoading] = useState(false);

  const username =
    localStorage.getItem("name")?.toLowerCase() || "user";

  const portfolioLink = `http://localhost:5173/portfolio/${username}`;
const fetchPortfolio = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      apiUrl("/api/portfolio"),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setProjects(res.data.projects || []);
    setAiContent(res.data.aiContent || "");

  } catch (err) {
    console.log(err);
  }
};
  // ADD PROJECT
const handleAddProject = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      apiUrl("/api/portfolio/project"),
      {
        title: newProject.title,
        description: newProject.description,
        skills: newProject.skills
          .split(",")
          .map((s) => s.trim()),
        date: newProject.date,
        link: newProject.link,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setProjects(res.data.projects);

    setNewProject({
      title: "",
      description: "",
      skills: "",
      date: "",
      link: "",
    });

    setShowAddForm(false);

  } catch (err) {
    console.log(err);
    alert("Failed to add project");
  }
};
  // GENERATE AI PORTFOLIO
  const generatePortfolioAI = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        apiUrl("/api/portfolio/generate"),
        { projects },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAiContent(res.data.content);
    } catch (err) {
      console.log(err);
      alert("Failed to generate AI portfolio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* <Navbar /> */}
      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* HEADER */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Portfolio Builder
            </h1>
            <p className="mt-1 text-muted-foreground">
              Showcase your projects and skills beautifully.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 relative z-50">
            <button onClick={exportPDF} className="inline-flex items-center px-3 py-2 rounded-md border border-border text-sm hover:bg-surface-elevated">
              <Download className="h-4 w-4 mr-1" /> Export PDF
            </button>
            <Link
              to={`/portfolio/${username}`}
              className="inline-flex items-center px-3 py-2 rounded-md border border-border text-sm hover:bg-surface-elevated"
            >
              <ExternalLink className="h-4 w-4 mr-1" /> Preview public
            </Link>
            <button
              className="inline-flex items-center px-3 py-2 rounded-md border border-border text-sm hover:bg-surface-elevated"
              onClick={() => {
                navigator.clipboard.writeText(portfolioLink);
                alert("Portfolio link copied!");
              }}
            >
              <ExternalLink className="h-4 w-4 mr-1" /> Share Portfolio
            </button>
            <button
              className="inline-flex items-center px-3 py-2 rounded-md bg-gradient-brand text-primary-foreground text-sm font-medium disabled:opacity-60"
              onClick={generatePortfolioAI}
              disabled={loading}
            >
              <Sparkles className="h-4 w-4 mr-1" />
              {loading ? "Generating..." : "Generate AI Portfolio"}
            </button>
          </div>
        </div>

        <div className="mt-8 grid lg:grid-cols-2 gap-6">
          <div className="space-y-5">

            {/* ADD PROJECT BUTTON + FORM */}
            <div className="card-glow rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Projects</h3>
                <button
                  className="inline-flex items-center px-2.5 py-1 rounded-md border border-border text-xs hover:bg-surface-elevated"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add project
                </button>
              </div>

              {/* ADD PROJECT FORM */}
              {showAddForm && (
                <div className="mt-4 rounded-xl border border-border bg-surface/60 p-4">
                  <form onSubmit={handleAddProject} className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium">Project Title</label>
                        <input
                          type="text"
                          className="mt-1 w-full h-9 px-3 rounded-md bg-surface/60 border border-border outline-none focus:border-brand-purple text-sm"
                          value={newProject.title}
                          onChange={(e) =>
                            setNewProject({ ...newProject, title: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium">Date</label>
                        <input
                          type="month"
                          className="mt-1 w-full h-9 px-3 rounded-md bg-surface/60 border border-border outline-none focus:border-brand-purple text-sm"
                          value={newProject.date}
                          onChange={(e) =>
                            setNewProject({ ...newProject, date: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium">Description</label>
                      <textarea
                        className="mt-1 w-full min-h-20 px-3 py-2 rounded-md bg-surface/60 border border-border outline-none focus:border-brand-purple text-sm"
                        rows={3}
                        value={newProject.description}
                        onChange={(e) =>
                          setNewProject({ ...newProject, description: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium">Skills (comma-separated)</label>
                        <input
                          type="text"
                          className="mt-1 w-full h-9 px-3 rounded-md bg-surface/60 border border-border outline-none focus:border-brand-purple text-sm"
                          placeholder="React, Node.js, MongoDB"
                          value={newProject.skills}
                          onChange={(e) =>
                            setNewProject({ ...newProject, skills: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium">Project Link</label>
                        <input
                          type="url"
                          className="mt-1 w-full h-9 px-3 rounded-md bg-surface/60 border border-border outline-none focus:border-brand-purple text-sm"
                          placeholder="https://example.com"
                          value={newProject.link}
                          onChange={(e) =>
                            setNewProject({ ...newProject, link: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-md border border-border text-xs hover:bg-surface-elevated"
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-md bg-gradient-brand text-primary-foreground text-xs font-medium"
                      >
                        Add Project
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* PROJECT LIST */}
              <div className="mt-4 space-y-3">
                {projects.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No projects yet. Start building your portfolio!
                  </p>
                )}
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="rounded-xl border border-border bg-surface/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{project.title}</div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(project.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {project.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-0.5 rounded-md bg-surface-elevated text-foreground/90 border border-border"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {project.link ? (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : (
                          <Github className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI OUTPUT */}
            {aiContent && (
              <div className="card-glow rounded-2xl p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-pink mb-3">
                  <Sparkles className="h-4 w-4" /> AI Portfolio Summary
                </div>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {aiContent}
                </pre>
              </div>
            )}
          </div>

          {/* LIVE PREVIEW PANEL */}
          <div className="lg:sticky lg:top-24 self-start">
   <div
  id="portfolio-preview"
  className="rounded-2xl p-8 relative overflow-hidden"
  style={{
    background: "#0f172a",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.1)",
  }}
>
              <div
                className="absolute -top-20 -right-20 h-60 w-60 rounded-full opacity-25 pointer-events-none"
               style={{
  background:
    "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
  filter: "blur(80px)",
}}
              />
              <div className="relative">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-brand grid place-items-center text-lg font-semibold text-primary-foreground uppercase">
                    {username.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-xl font-display font-semibold capitalize">
                      {localStorage.getItem("name") || "Your Name"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Developer · Portfolio Preview
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-xs uppercase tracking-[0.2em] text-brand-pink">
                    Featured Projects
                  </div>
                  <div className="mt-3 grid gap-3">
                    {projects.slice(0, 3).map((p) => (
                      <div
                        key={p.id}
                        className="rounded-xl border border-border bg-surface/40 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">{p.title}</div>
                          {p.link && (
                            <a
                              href={p.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {p.description}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {p.skills.slice(0, 3).map((s, i) => (
                            <span
                              key={i}
                              className="text-xs px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-foreground/80"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {aiContent && (
                  <div className="mt-6 rounded-xl border border-brand-purple/40 bg-surface/40 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-brand-pink">
                      <Sparkles className="h-4 w-4" /> AI suggestions
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-4">
                      {aiContent.slice(0, 200)}…
                    </p>
                  </div>
                )}

                {!aiContent && (
                  <div className="mt-6 rounded-xl border border-brand-purple/40 bg-surface/40 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-brand-pink">
                      <Sparkles className="h-4 w-4" /> AI suggestions
                    </div>
                    <ul className="mt-2 text-xs text-muted-foreground space-y-1">
                      <li>· Add measurable impact to your projects (e.g. concurrent users).</li>
                      <li>· Generate an AI portfolio summary to stand out.</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
