import fs from "fs";
import { extractTextFromPDF } from "../services/pdf.service.js";
import { generateWithGemini } from "../services/gemini.service.js";

export const generateSummary = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Resume file required" });
    }

    const resumeText = await extractTextFromPDF(req.file.path);

    const summary = await generateWithGemini(resumeText);

    fs.unlinkSync(req.file.path);

    res.json({ summary });
  } catch (error) {
    console.error("Error:", error.message);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: error.message || "Failed to generate summary",
    });
  }
};
