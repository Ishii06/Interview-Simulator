import express from "express";
import { protect } from "../middleware/auth.js";
import multer from "multer";
import {
  generateQuestion,
  transcribeAnswer,
  getInterviewHistory,
  evaluateInterview,
} from "../controllers/interviewController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

router.post("/question", protect, generateQuestion);
router.post("/transcribe", protect, upload.single("file"), transcribeAnswer);
router.post("/evaluate", protect, evaluateInterview);
router.get("/history", protect, getInterviewHistory);

export default router;
