import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateWithGemini = async (resumeText) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey || apiKey === "YOUR_NEW_API_KEY_HERE") {
      throw new Error(
        "GEMINI_API_KEY not configured. Add your key to backend/.env (get one at https://aistudio.google.com/apikey)",
      );
    }

    console.log("🤖 Calling Gemini AI (model: gemini-2.5-flash)...");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 2096,
        topP: 0.95,
      },
    });

    const trimmedResume = resumeText.slice(0, 30000).trim();

    if (!trimmedResume) {
      throw new Error("No readable text extracted from the PDF");
    }

    const prompt = `You are an expert resume writer and career coach.

TASK:
Generate a professional resume summary consisting of EXACTLY 15 sentences.

MANDATORY FORMAT (DO NOT BREAK):
- Write the summary as 15 separate sentences.
- Each sentence MUST start on a new line.
- Each sentence MUST focus on a different aspect:
  1. Overall professional profile
  2. Total experience and domain exposure
  3. Core technical skills
  4. Backend development experience
  5. Frontend development experience
  6. Database and data handling skills
  7. Architecture and design principles
  8. Project experience and real-world applications
  9. Problem-solving and debugging abilities
  10. Tools, frameworks, and technologies used
  11. Collaboration, learning, or adaptability
  12. Overall professional value and impact
  13. Cloud/DevOps or deployment experience
  14. Soft skills and leadership/mentorship
  15. Career trajectory and future potential

STYLE RULES:
- Use third person only
- Make sentences detailed and descriptive (2-3 clauses each, avoid very short sentences)
- Use ATS-friendly keywords from the resume
- No bullets, no numbering, no headings
- Output ONLY the 15 sentences

Resume content:
${trimmedResume}`;

    const result = await model.generateContent(prompt);
    const response = result.response;

    if (!response) {
      throw new Error("No response received from Gemini API");
    }

    let summary;
    try {
      summary = response.text();
    } catch (textError) {
      const candidates = response.candidates;
      const blockReason = candidates?.[0]?.finishReason || "blocked";
      throw new Error(
        `Gemini blocked the response (reason: ${blockReason}). ` +
          "This can happen if the resume contains template text. Try a different resume.",
      );
    }

    if (!summary || typeof summary !== "string") {
      const candidates = response.candidates;
      const blockReason = candidates?.[0]?.finishReason || "unknown";
      throw new Error(
        `Gemini blocked or returned empty response (reason: ${blockReason}). ` +
          "This can happen if the resume contains template text. Try a different resume.",
      );
    }

    const trimmed = summary.trim();
    if (!trimmed) {
      throw new Error("Gemini returned an empty summary");
    }

    console.log("✅ Gemini AI response received, length:", trimmed.length);

    return trimmed;
  } catch (error) {
    const msg = error.message || String(error);
    console.error("❌ Gemini Error:", msg);

    if (msg.includes("API key") || msg.includes("401") || msg.includes("403")) {
      throw new Error(
        "Invalid or restricted Gemini API key. Check your key at https://aistudio.google.com/apikey and ensure it has no HTTP referrer restrictions for localhost.",
      );
    }
    if (msg.includes("RECITATION") || msg.includes("blocked")) {
      throw new Error(
        "Gemini blocked this resume (possible template/copyright text). Try rephrasing or using a different resume.",
      );
    }

    throw new Error("AI generation failed: " + msg);
  }
};
