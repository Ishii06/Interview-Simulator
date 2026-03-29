import { supabase } from '../config/supabaseClient.js'

export const addQuestions = async (req, res) => {
  const { test_id, questions, difficulty } = req.body

  const formatted = questions.map(q => ({
    test_id,
    section: q.section,
    question: q.question,
    options: q.options,
    correct_answer: q.correct_answer,
    difficulty: q.difficulty ?? difficulty ?? "medium"
  }))

  const { data, error } = await supabase
    .from('questions')
    .insert(formatted)

  if (error) return res.status(400).json({ error })

  res.json({ message: "Questions added" })
}

export const getQuestionsByTestId = async (req, res) => {
  try {
    const { test_id } = req.params

    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('test_id', test_id)
      .order('id', { ascending: true })

    if (error) return res.status(400).json({ error: error.message })

    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
