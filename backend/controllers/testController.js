import { supabase } from '../config/supabaseClient.js'
import { generateQuestions } from '../services/pythonService.js'

export const createTest = async (req, res) => {
  try {
    const { user_id, type, role, difficulty } = req.body

    const duration = type === "aptitude" ? 60 : 45

    // 1️⃣ Create test first
    const { data: testData, error: testError } = await supabase
      .from('tests')
      .insert([{
        user_id,
        type,
        role,
        difficulty,
        duration,
        start_time: new Date()
      }])
      .select()
      .single()

    if (testError) throw testError

    // 2️⃣ Call Python to generate questions
    const questions = await generateQuestions({
      type,
      difficulty,
      role
    })

    // 3️⃣ Attach test_id to questions
    const formattedQuestions = questions.map(q => ({
      ...q,
      test_id: testData.id
    }))

    // 4️⃣ Insert into Supabase
    const { error: questionError } = await supabase
      .from('questions')
      .insert(formattedQuestions)

    if (questionError) throw questionError

    res.json({
      message: "Test created successfully",
      test_id: testData.id
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
