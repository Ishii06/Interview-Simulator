import { generateQuestionFromAI } from "../services/aiService.js";

export const generateQuestion = async (req, res) => {
  try {
    const { role, experience, skills, difficulty } = req.body;

    const data = await generateQuestionFromAI({
      role,
      experience,
      skills,
      difficulty,
    });

    res.json({
      questionText: data.questionText,
      audioUrl: `http://localhost:8000${data.audioUrl}`, 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "AI service failed" });
  }
};
