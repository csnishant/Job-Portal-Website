import Groq from "groq-sdk";
import { getKeywordMatches, calculateATSScore } from "./atsCalculator.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const analyzeResume = async (resumeText, jobDescription) => {
  const { matched, missing } = getKeywordMatches(resumeText, jobDescription);

  const score = calculateATSScore(matched, matched.length + missing.length);

  const prompt = `
Return ONLY JSON:

{
  "improvementTips": []
}

Missing skills:
${missing.join(", ")}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  const text = response.choices[0].message.content;

  const jsonMatch = text.match(/\{[\s\S]*\}/);

  let aiData = { improvementTips: [] };

  try {
    aiData = JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.log("AI parse error:", text);
  }

  return {
    score,
    matchedKeywords: matched,
    missingKeywords: missing,
    improvementTips: aiData.improvementTips,
  };
};
