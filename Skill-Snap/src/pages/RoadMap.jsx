import React, { useState,useEffect } from 'react';

const roadmapData = {
  web: ["HTML", "CSS", "JavaScript", "React", "Tailwind"],
  dsa: ["Arrays", "Linked List", "Stacks", "Trees", "DP"]
};



function Roadmap() {
  const [selected, setSelected] = useState("web");
  const [progress, setProgress] = useState({});
useEffect(() => {
    const stored = localStorage.getItem("skillProgress");
    if (stored) {
      setProgress(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("skillProgress", JSON.stringify(progress));
  }, [progress]);


  const toggleStep = (step) => {
    setProgress({ ...progress, [step]: !progress[step] });
  };

    const completedSteps = roadmapData[selected].filter((step) => progress[step]);
  const completionPercent = Math.round(
    (completedSteps.length / roadmapData[selected].length) * 100
  );

  return (
    <div className="Roadmap">
      <h2 className="heading">Choose a Roadmap</h2>
      <select onChange={(e) => setSelected(e.target.value)}>
        <option value="web">Web Development</option>
        <option value="dsa">DSA</option>
      </select>

 <div className="progress-container">
        <div className="progress-bar" style={{ width: `${completionPercent}%` }}></div>
      </div>
      <p className="progress-text">{completionPercent}% Complete</p>

      <div className="selected">
        {roadmapData[selected].map((step) => (
          <div key={step}>
            <input
              type="checkbox"
              checked={progress[step] || false}
              onChange={() => toggleStep(step)}
            />
            <label className="display">{step}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Roadmap ;
