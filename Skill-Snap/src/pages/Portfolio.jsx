import React, { useState, useRef } from "react";

import html2pdf from "html2pdf.js";

function Portfolio() {
	const [form, setForm] = useState({
		name: "",
		skills: "",
		projects: "",
	});
    
	const displayRef = useRef();

	const handleDownload = () => {
		const element = displayRef.current;
		const options = {
			margin: 0.5,
			filename: `${form.name || "portfolio"}.pdf`,
			image: { type: "jpeg", quality: 0.98 },
			html2canvas: { scale: 2 },
			jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
		};
		html2pdf().set(options).from(element).save();
	};

	return (
		<div className="Form">
			<h2 className="heading">Build Your Portfolio</h2>
			<input
				placeholder="Your Name"
				onChange={(e) => setForm({ ...form, name: e.target.value })}
				className="Form-name"
			/>
			<textarea
				placeholder="Your Skills (comma separated)"
				onChange={(e) => setForm({ ...form, skills: e.target.value })}
				className="Form-skills"
			/>
			<textarea
				placeholder="Your Projects"
				onChange={(e) => setForm({ ...form, projects: e.target.value })}
				className="Form-projects"
			/>
			<button onClick={handleDownload} className="download-btn">
				📥 Download PDF
			</button>
			<div className="display">
				<h3 className="Name">{form.name}</h3>
				<p>Skills:{form.skills}</p>
				<p>Projects: {form.projects}</p>
			</div>
		</div>
	);
}

export default Portfolio;
