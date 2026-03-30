import axios from "axios"
import { supabase } from "../config/supabaseClient.js"

const normalizeSection = (section) => {
  const value = String(section ?? "").trim().toLowerCase()

  if (value === "verbal" || value === "logical" || value === "numerical") {
    return value
  }

  return "verbal"
}

const normalizeOptions = (options) => {
  if (!Array.isArray(options)) {
    return []
  }

  return options
    .map((option) => String(option ?? "").trim())
    .filter(Boolean)
}

const normalizeQuestion = (question, fallbackDifficulty) => {
  const questionText = String(question?.question ?? "").trim()

  if (!questionText) {
    return null
  }

  const options = normalizeOptions(question?.options)
  const correctAnswer = String(question?.correct_answer ?? "").trim() || options[0] || ""
  const difficulty = String(question?.difficulty ?? fallbackDifficulty ?? "").trim() || fallbackDifficulty

  return {
    section: normalizeSection(question?.section),
    question: questionText,
    options,
    correct_answer: correctAnswer,
  }
}

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

    const formattedQuestions = questions
      .map((question) => normalizeQuestion(question, difficulty))
      .filter(Boolean)

    if (formattedQuestions.length === 0) {
      return res.status(502).json({
        error: "AI service returned questions that could not be normalized",
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

    if (testError) {
      throw new Error(testError.message || "Failed to create test")
    }

    // Attach test_id to every generated question and return inserted rows.
    const questionsToInsert = formattedQuestions.map((question) => ({
      test_id: testData.id,
      ...question,
    }))

    const { data: insertedQuestions, error: questionError } = await supabase
      .from("questions")
      .insert(questionsToInsert)
      .select("*")

    if (questionError) {
      throw new Error(questionError.message || "Failed to create questions")
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

    res.status(500).json({
      error: error.message || "Failed to create test",
    })
  }
}

export const getTestHistory = async (req, res) => {
  try {
    const user_id = req.user?.id

    if (!user_id) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    const { data: tests, error: testError } = await supabase
      .from("tests")
      .select("id, user_id, role, experience, difficulty, start_time, end_time, is_submitted, created_at")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(50)

    if (testError) {
      return res.status(500).json({ error: testError.message })
    }

    const testIds = (tests || []).map((test) => test.id)

    let resultsByTestId = {}

    if (testIds.length > 0) {
      const { data: results, error: resultError } = await supabase
        .from("results")
        .select("test_id, score, total, percentage, created_at")
        .in("test_id", testIds)
        .order("created_at", { ascending: false })

      if (resultError) {
        return res.status(500).json({ error: resultError.message })
      }

      resultsByTestId = (results || []).reduce((accumulator, result) => {
        if (!accumulator[result.test_id]) {
          accumulator[result.test_id] = result
        }

        return accumulator
      }, {})
    }

    const history = (tests || []).map((test) => {
      const latestResult = resultsByTestId[test.id]

      return {
        ...test,
        result: latestResult || null,
        attempt_label: test.is_submitted ? "Completed" : "In progress",
      }
    })

    return res.json({ history })
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to fetch test history" })
  }
}