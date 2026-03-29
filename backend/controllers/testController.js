import axios from "axios"
import { supabase } from "../config/supabaseClient.js"

export const createTest = async (req, res) => {
  try {
    const { role, experience, difficulty } = req.body
    const user_id = req.user?.id

    if (!user_id) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    if (!role || !experience || !difficulty) {
      return res.status(400).json({ error: "role, experience and difficulty are required" })
    }

    // 🔥 Call Python
    const response = await axios.post(
      "http://localhost:8000/generate-mock-test",
      { role, experience, difficulty }
    )

    const questions = response?.data?.questions

    if (!Array.isArray(questions) || questions.length === 0) {
      const upstreamError = response?.data?.error || "Question generation failed"
      return res.status(502).json({
        error: `AI service error: ${upstreamError}`
      })
    }

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

    // Attach test_id to every generated question and return inserted rows.
    const formattedQuestions = questions.map((q) => ({
      ...q,
      difficulty: q.difficulty ?? difficulty,
      test_id: testData.id
    }))

    const { data: insertedQuestions, error: questionError } = await supabase
      .from("questions")
      .insert(formattedQuestions)
      .select("*")

    if (questionError) {
      throw questionError
    }

    res.json({
      user_id,
      test_id: testData.id,
      end_time: endISO,
      questions: insertedQuestions || []
    })

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const upstreamMessage = error.response?.data?.error || error.message
      const upstreamStatus = error.response?.status

      return res.status(upstreamStatus && upstreamStatus >= 400 ? upstreamStatus : 502).json({
        error: `AI service error: ${upstreamMessage}`
      })
    }

    res.status(500).json({ error: error.message })
  }
}