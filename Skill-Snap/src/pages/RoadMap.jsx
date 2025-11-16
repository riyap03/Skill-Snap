// import React, { useState,useEffect } from 'react';

// const roadmapData = {
//   web: ["HTML", "CSS", "JavaScript", "React", "Tailwind"],
//   dsa: ["Arrays", "Linked List", "Stacks", "Trees", "DP"]
// };



// function Roadmap() {
//   const [selected, setSelected] = useState("web");
//   const [progress, setProgress] = useState({});
// useEffect(() => {
//     const stored = localStorage.getItem("skillProgress");
//     if (stored) {
//       setProgress(JSON.parse(stored));
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("skillProgress", JSON.stringify(progress));
//   }, [progress]);


//   const toggleStep = (step) => {
//     setProgress({ ...progress, [step]: !progress[step] });
//   };

//     const completedSteps = roadmapData[selected].filter((step) => progress[step]);
//   const completionPercent = Math.round(
//     (completedSteps.length / roadmapData[selected].length) * 100
//   );

//   return (
//     <div className="Roadmap">
//       <h2 className="heading">Choose a Roadmap</h2>
//       <select onChange={(e) => setSelected(e.target.value)}>
//         <option value="web">Web Development</option>
//         <option value="dsa">DSA</option>
//       </select>

//  <div className="progress-container">
//         <div className="progress-bar" style={{ width: `${completionPercent}%` }}></div>
//       </div>
//       <p className="progress-text">{completionPercent}% Complete</p>

//       <div className="selected">
//         {roadmapData[selected].map((step) => (
//           <div key={step}>
//             <input
//               type="checkbox"
//               checked={progress[step] || false}
//               onChange={() => toggleStep(step)}
//             />
//             <label className="display">{step}</label>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Roadmap ;


import React, { useEffect, useMemo, useState } from "react";

export default function Roadmap() {
  const roadmaps = useMemo(
    () => ({
      "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Tailwind CSS"],
      "Backend Developer": ["Node.js", "Express", "Databases", "API Design", "Authentication", "Security"],
      "Full Stack": ["Frontend Basics", "Backend Basics", "Deployment", "Testing", "DevOps", "Performance"],
      "UI/UX Designer": ["Design Principles", "Figma", "User Research", "Prototyping", "Accessibility", "Design Systems"],
      "Data Scientist": ["Python", "Statistics", "Machine Learning", "Data Visualization", "SQL", "Deep Learning"],
      "Mobile Developer": ["React Native", "Mobile UI", "Native APIs", "App Store", "Performance", "Testing"],
    }),
    []
  );

  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState({}); // { skillName: true/false }

  // Reset checks whenever roadmap changes
  useEffect(() => {
    if (!selected) {
      setChecked({});
      return;
    }
    const fresh = Object.fromEntries(roadmaps[selected].map((s) => [s, false]));
    setChecked(fresh);
  }, [selected, roadmaps]);

  const total = selected ? roadmaps[selected].length : 0;
  const completed = Object.values(checked).filter(Boolean).length;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  const toggleSkill = (skill) => {
    setChecked((prev) => ({ ...prev, [skill]: !prev[skill] }));
  };

  return (
    <section className="roadmap-wrap">
      <div className="roadmap-card">
        <h2 className="roadmap-title">Choose Your Roadmap</h2>
        <p className="roadmap-subtitle">
          Select a learning path and track your progress as you master each skill.
        </p>

        {/* dreamy dropdown */}
        <div className="rm-select-wrap">
          <select
            className="rm-select"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">— Select a roadmap —</option>
            {Object.keys(roadmaps).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <span className="rm-select-glow" />
        </div>

        {/* skill pills */}
        {selected && (
          <div className="skills-grid">
            {roadmaps[selected].map((skill) => {
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

        {/* progress */}
        {selected && (
          <div className="progress-area">
            <div className="progress-head">
              <span className="progress-label">Progress</span>
              <span className="progress-value">{progress}%</span>
            </div>
            <div className="progress-shell">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                role="progressbar"
              />
            </div>
            {!!total && (
              <p className="progress-sub">
                {completed} / {total} steps completed
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
