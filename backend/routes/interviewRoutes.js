import express from "express";
import { protect } from "../middleware/auth.js";
import { generateQuestion } from "../controllers/interviewController.js";

const router = express.Router();

router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

router.post("/question", protect, generateQuestion);

export default router;
