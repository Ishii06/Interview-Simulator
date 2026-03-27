import axios from "axios"
import { supabase } from "../config/supabaseClient.js"

export const createTest = async (req, res) => {
  try {
    const { user_id, role, experience, difficulty } = req.body

    // 🔥 Call Python
    const response = await axios.post(
      "http://localhost:8000/generate-mock-test",
      { role, experience, difficulty }
    )

    const questions = response.data.questions

    // 🔥 Always use UTC ISO strings
    const startTime = new Date()
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000)

    const startISO = startTime.toISOString()
    const endISO = endTime.toISOString()

    // 🔥 Insert Test
    const { data: testData, error: testError } = await supabase
      .from("tests")
      .insert([{
        user_id,
        role,
        experience,
        difficulty,
        start_time: startISO,
        end_time: endISO,
        is_submitted: false
      }])
      .select()
      .single()

    if (testError) throw testError

    // 🔥 Attach test_id to questions
    // 🔥 Attach test_id to questions
const formattedQuestions = questions.map(q => ({
  ...q,
  test_id: testData.id
}))

const { error: questionError } = await supabase
  .from("questions")
  .insert(formattedQuestions)

if (questionError) {
  throw questionError
}
    res.json({
      test_id: testData.id,
      end_time: endISO
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}