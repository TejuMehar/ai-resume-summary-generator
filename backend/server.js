import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import resumeRoutes from "./routes/resumeRoute.js";
import fs from "fs";

dotenv.config();

// Validate API key on startup (don't log the key)
const apiKey = process.env.GEMINI_API_KEY?.trim();
if (!apiKey || apiKey === "YOUR_NEW_API_KEY_HERE") {
  console.warn("⚠️  GEMINI_API_KEY not set in .env — resume summary will fail. Get a key at https://aistudio.google.com/apikey");
} else {
  console.log("✓ GEMINI_API_KEY is configured");
}

const app = express();

// Create uploads directory if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

/* ---------- Middlewares ---------- */
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

/* ---------- Routes ---------- */
app.use("/api/resume", resumeRoutes);

/* ---------- Health Check ---------- */
app.get("/", (req, res) => {
  res.send("AI Resume Summary Generator API is running 🚀");
});

/* ---------- Global Error Handler ---------- */
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Multer file upload errors
  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Custom or general errors
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ---------- Server ---------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
