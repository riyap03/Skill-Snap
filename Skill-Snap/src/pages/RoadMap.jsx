import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ROADMAPS } from "../data/roadmaps";

export default function Roadmap() {
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState({});
  const [stats, setStats] = useState(null);
  const [insight, setInsight] = useState(null);
  const [showTestPopup, setShowTestPopup] = useState(false);

  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Check if user has taken test
  useEffect(() => {
    const checkTest = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          "http://localhost:5000/api/progress/check",
          getAuthHeader()
        );

        if (!res.data.hasTakenTest) {
          setShowTestPopup(true);
        }
      } catch (err) {
        console.error("Failed to check test status", err);
      }
    };

    checkTest();
  }, []);

  const slugify = (name) =>
    name.replace(/\s+/g, "-").replace(/\//g, "-").toLowerCase();

  // Fetch roadmap, stats, and insights whenever selected changes
  useEffect(() => {
    if (!selected) {
      setChecked({});
      setStats(null);
      setInsight(null);
      return;
    }

    const slug = slugify(selected);

    // Fetch roadmap skills
    axios
      .get(`http://localhost:5000/api/roadmaps/${slug}`, getAuthHeader())
      .then((res) => {
        if (res.data.skills) {
          setChecked(res.data.skills);
        } else {
          setChecked(
            Object.fromEntries(ROADMAPS[selected].map((s) => [s, false]))
          );
        }
      })
      .catch(() => console.error("Failed to fetch roadmap"));

    // Fetch weekly stats
    axios
      .get(`http://localhost:5000/api/roadmaps/${slug}/stats?range=weekly`, getAuthHeader())
      .then((res) => setStats(res.data))
      .catch(() => setStats(null));

    // Fetch AI insight
    axios
      .get(`http://localhost:5000/api/roadmaps/${slug}/insights`, getAuthHeader())
      .then((res) => setInsight(res.data.message))
      .catch(() => setInsight(null));
  }, [selected]);

  // Toggle skill completion
  const toggleSkill = async (skill) => {
    const newStatus = !checked[skill];
    const slug = slugify(selected);

    setChecked((prev) => ({ ...prev, [skill]: newStatus }));

    try {
      await axios.patch(
        `http://localhost:5000/api/roadmaps/${slug}/skill`,
        { skillName: skill, status: newStatus },
        getAuthHeader()
      );
    } catch (err) {
      setChecked((prev) => ({ ...prev, [skill]: !newStatus }));
      console.error("Failed to update skill", err);
    }
  };

  // Export PDF
  const exportPDF = async () => {
    if (!selected) return;
    const slug = slugify(selected);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/roadmaps/${slug}/export`,
        { ...getAuthHeader(), responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${slug}-progress.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to export PDF", err);
    }
  };

  // Progress calculation
  const total = selected ? ROADMAPS[selected].length : 0;
  const completed = Object.values(checked).filter(Boolean).length;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  return (
    <>
      {showTestPopup && (
        <div className="test-popup">
          <div className="popup-card">
            <h3>Before starting roadmap...</h3>
            <p>SkillSnap needs to understand your level.</p>
            <button onClick={() => navigate("/test")}>Take Diagnostic Test</button>
            <button onClick={() => setShowTestPopup(false)}>Skip for now</button>
          </div>
        </div>
      )}

      <section className="roadmap-wrap">
        <div className="roadmap-card">
          <h2 className="roadmap-title">Choose Your Roadmap</h2>
          <p className="roadmap-subtitle">
            Select a learning path and track your progress as you master each skill.
          </p>

          <div className="rm-select-wrap">
            <select
              className="rm-select"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="">— Select a roadmap —</option>
              {Object.keys(ROADMAPS).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <span className="rm-select-glow" />
          </div>

          {selected && (
            <div className="skills-grid">
              {ROADMAPS[selected].map((skill) => {
                const id = `skill-${skill.replace(/\s+/g, "-").toLowerCase()}`;
                return (
                  <label className="skill-pill" htmlFor={id} key={skill}>
                    <input
                      id={id}
                      type="checkbox"
                      checked={!!checked[skill]}
                      onChange={() => toggleSkill(skill)}
                    />
                    <span className="pill-face">{skill}</span>
                  </label>
                );
              })}
            </div>
          )}

          {selected && (
            <div className="progress-area">
              <div className="progress-head">
                <span className="progress-label">Progress</span>
                <span className="progress-value">{progress}%</span>
              </div>
              <div
                className="progress-shell"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              {!!total && (
                <p className="progress-sub">
                  {completed} / {total} steps completed
                </p>
              )}
            </div>
          )}

          {selected && stats && (
            <div className="stats-area">
              <h4 className="stats-title">Weekly Stats</h4>
              <pre className="stats-json">{JSON.stringify(stats, null, 2)}</pre>
            </div>
          )}

          {selected && insight && (
            <div className="insight-area">
              <h4 className="insight-title">AI Insight</h4>
              <p className="insight-text">{insight}</p>
            </div>
          )}
        </div>
      </section>

      <div className="rm-actions">
        <button
          onClick={exportPDF}
          disabled={!selected}
          className="btn btn-secondary"
        >
          Export as PDF
        </button>
      </div>
    </>
  );
}
