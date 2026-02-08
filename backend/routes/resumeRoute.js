import express from "express";
import { generateSummary } from "../controllers/resumeController.js";
import { uploadResume } from "../middlewares/upload.js";

const router = express.Router();

router.post("/generate", uploadResume.single("resume"), generateSummary);

export default router;
