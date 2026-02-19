import { supabase } from '../config/supabaseClient.js'

export const addQuestions = async (req, res) => {
  const { test_id, questions } = req.body

  const formatted = questions.map(q => ({
    test_id,
    section: q.section,
    question: q.question,
    options: q.options,
    correct_answer: q.correct_answer,
    difficulty: q.difficulty
  }))

  const { data, error } = await supabase
    .from('questions')
    .insert(formatted)

  if (error) return res.status(400).json({ error })

  res.json({ message: "Questions added" })
}
