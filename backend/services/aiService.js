const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generatePortfolio(projects) {
  const model = genAI.getGenerativeModel({
   model: "gemini-2.0-flash",
  });

  const formattedProjects = projects.map((p) => `
  Project: ${p.title}
  Description: ${p.description}
  Skills: ${p.skills.join(", ")}
  `).join("\n");

  const prompt = `
You are a professional portfolio writer.

Based on these projects:

${formattedProjects}

Generate:
1. Developer Bio
2. About Me section
3. Technical Strengths
4. Career Summary

Keep it modern, concise, and impressive.
`;

  const result = await model.generateContent(prompt);

  return result.response.text();
}

module.exports = generatePortfolio;