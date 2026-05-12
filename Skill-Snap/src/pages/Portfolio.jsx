import { useState } from "react";
import axios from "axios";
import {
  Plus,
  ExternalLink,
  Calendar,
  Tag,
  Sparkles,
} from "lucide-react";
import { apiUrl } from "../config/api";

export default function Portfolio() {
  const [projects, setProjects] = useState([
    {
      id: "1",
      title: "E-Commerce Platform",
      description:
        "Built a full-stack e-commerce platform with React, Node.js, and MongoDB.",
      skills: ["React", "Node.js", "MongoDB", "Stripe"],
      date: "2024-10",
      link: "https://example.com",
    },
    {
      id: "2",
      title: "Task Management App",
      description:
        "Designed and developed a task management app with drag-and-drop functionality.",
      skills: ["React", "TypeScript", "Tailwind CSS"],
      date: "2024-09",
    },
  ]);

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
  localStorage.getItem("name")
    ?.toLowerCase() || "user";

const portfolioLink =
  `http://localhost:5173/portfolio/${username}`;
  // ADD PROJECT
  const handleAddProject = (e) => {
    e.preventDefault();

    const project = {
      id: Date.now().toString(),
      title: newProject.title,
      description: newProject.description,
      skills: newProject.skills
        .split(",")
        .map((s) => s.trim()),
      date: newProject.date,
      link: newProject.link || undefined,
    };

    setProjects([project, ...projects]);

    setNewProject({
      title: "",
      description: "",
      skills: "",
      date: "",
      link: "",
    });

    setShowAddForm(false);
  };

  // GENERATE AI PORTFOLIO
  const generatePortfolioAI = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        apiUrl("/api/portfolio/generate"),
        {
          projects,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    <section className="portfolio-wrap">
      {/* HEADER */}
      <div className="portfolio-header">
        <div>
          <h2 className="portfolio-title">
            Your Portfolio
          </h2>

          <p className="portfolio-subtitle">
            Showcase your projects and skills beautifully.
          </p>
        </div>

        <div className="portfolio-actions">
          <button
            className="btn-add-project"
            onClick={() =>
              setShowAddForm(!showAddForm)
            }
          >
            <Plus size={18} />
            Add Project
          </button>
          

          <button
            className="btn-ai"
            onClick={generatePortfolioAI}
            disabled={loading}
          >
            <Sparkles size={18} />

            {loading
              ? "Generating..."
              : "Generate AI Portfolio"}
          </button>
          <button
  className="btn-share"
  onClick={() => {
    navigator.clipboard.writeText(
      portfolioLink
    );

    alert(
      "Portfolio link copied!"
    );
  }}
>
  Share Portfolio
</button>
        </div>
      </div>

      {/* ADD PROJECT FORM */}
      {showAddForm && (
        <div className="add-project-form">
          <form onSubmit={handleAddProject}>
            <div className="form-group">
              <label htmlFor="title">
                Project Title
              </label>

              <input
                id="title"
                type="text"
                className="form-input"
                value={newProject.title}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    title: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                className="form-textarea"
                rows={4}
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="skills">
                  Skills
                </label>

                <input
                  id="skills"
                  type="text"
                  className="form-input"
                  placeholder="React, Node.js, MongoDB"
                  value={newProject.skills}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      skills: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">
                  Date
                </label>

                <input
                  id="date"
                  type="month"
                  className="form-input"
                  value={newProject.date}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      date: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="link">
                Project Link
              </label>

              <input
                id="link"
                type="url"
                className="form-input"
                placeholder="https://example.com"
                value={newProject.link}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    link: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() =>
                  setShowAddForm(false)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-submit"
              >
                Add Project
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PROJECTS */}
      <div className="projects-grid">
        {projects.map((project) => (
          <div
            key={project.id}
            className="project-card"
          >
            <div className="project-header">
              <h3>{project.title}</h3>

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  <ExternalLink size={18} />
                </a>
              )}
            </div>

            <p className="project-description">
              {project.description}
            </p>

            <div className="project-meta">
              <div className="project-date">
                <Calendar size={14} />

                <span>
                  {new Date(
                    project.date
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            </div>

            <div className="project-skills">
              <Tag size={14} />

              <div className="skill-tags">
                {project.skills.map(
                  (skill, idx) => (
                    <span
                      key={idx}
                      className="skill-tag"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {projects.length === 0 && (
        <div className="empty-state">
          <p>
            No projects yet. Start building
            your portfolio!
          </p>
        </div>
      )}

      {/* AI OUTPUT */}
      {aiContent && (
        <div className="ai-output">
          <div className="ai-header">
            <Sparkles size={20} />
            <h3>AI Portfolio Summary</h3>
          </div>

          <div className="ai-content">
            <pre>{aiContent}</pre>
          </div>
        </div>
      )}
    </section>
    
  );
}
