import { supabase } from "../config/supabaseClient.js"

const toReliableMillis = (value) => {
  if (!value) return NaN

  if (typeof value === "number") return value

  const raw = String(value).trim()
  if (!raw) return NaN

  if (/^\d+$/.test(raw)) return Number(raw)

  const normalized = raw.replace(" ", "T")
  const hasTimezone = /Z$|[+-]\d{2}:?\d{2}$/.test(normalized)

  if (hasTimezone) {
    return Date.parse(normalized)
  }

  const asLocal = Date.parse(normalized)
  const asUtc = Date.parse(`${normalized}Z`)

  if (Number.isFinite(asLocal) && Number.isFinite(asUtc)) {
    // Choose the later interpretation to avoid false "expired" due to timezone ambiguity.
    return Math.max(asLocal, asUtc)
  }

  return Number.isFinite(asLocal) ? asLocal : asUtc
}

const normalizeAnswers = (answers) => {
  const normalized = {
    byId: {},
    byQuestion: {},
    byIndex: {}
  }

  if (!answers) return normalized

  if (Array.isArray(answers)) {
    answers.forEach((item, idx) => {
      const key = item?.question_id ?? item?.questionId ?? item?.id
      const questionText = item?.question ?? item?.question_text
      const value = item?.answer ?? item?.selected_option ?? item?.selectedAnswer

      if (key !== undefined && value !== undefined) {
        normalized.byId[String(key)] = value
      }

      if (questionText && value !== undefined) {
        normalized.byQuestion[normalizeText(questionText)] = value
      }

      if (value !== undefined) {
        normalized.byIndex[String(idx)] = value
      }
    })

    return normalized
  }

  if (typeof answers === "object") {
    Object.entries(answers).forEach(([key, value]) => {
      normalized.byId[String(key)] = value
      normalized.byIndex[String(key)] = value
    })
  }

  return normalized
}

const normalizeText = (value) => String(value ?? "").trim().toLowerCase()

const buildFallbackExplanation = (question) => {
  if (question?.explanation && String(question.explanation).trim()) {
    return String(question.explanation).trim()
  }

  const answer = String(question?.correct_answer ?? "").trim()
  if (!answer) {
    return "This answer is marked correct based on the test answer key."
  }

  return `The correct option is \"${answer}\" because it best matches the expected concept for this question.`
}

export const submitTest = async (req, res) => {
  try {
    const { test_id, answers } = req.body
    const user_id = req.user?.id
    const debug = req.query?.debug === "true"

    if (!user_id) {
      return res.status(401).json({
        error: "Not authenticated",
      })
    }

    if (!test_id) {
      return res.status(400).json({
        error: "test_id is required",
      })
    }

    const { data: test, error: testError } = await supabase
      .from("tests")
      .select("*")
      .eq("id", test_id)
      .eq("user_id", user_id)
      .maybeSingle()

    if (testError) {
      return res.status(400).json({ error: testError.message })
    }

    if (!test) {
      return res.status(404).json({ message: "Test not found" })
    }

    if (test.is_submitted) {
      return res.status(400).json({ message: "Already submitted" })
    }

    const now = Date.now()
    const parsedEndTime = toReliableMillis(test.end_time)
    const parsedStartTime = toReliableMillis(test.start_time)
    const fallbackEndTime = Number.isFinite(parsedStartTime)
      ? parsedStartTime + 60 * 60 * 1000
      : NaN
    const endTime = Number.isFinite(parsedEndTime) ? parsedEndTime : fallbackEndTime
    const isExpired = Number.isFinite(endTime) ? now > endTime : false

    const { data: questions, error: qError } = await supabase
      .from("questions")
      .select("*")
      .eq("test_id", test_id)

    if (qError) {
      return res.status(500).json({ error: qError.message })
    }

    let score = 0
    const submittedAnswers = normalizeAnswers(answers)
    const debugDetails = []
    const review = []

    questions.forEach((q, idx) => {
      const submitted = submittedAnswers.byId[String(q.id)]
        ?? submittedAnswers.byQuestion[normalizeText(q.question)]
        ?? submittedAnswers.byIndex[String(idx)]

      const isCorrect = normalizeText(submitted) === normalizeText(q.correct_answer)

      if (isCorrect) {
        score++
      }

      review.push({
        question_id: q.id,
        section: q.section ?? null,
        question: q.question,
        options: Array.isArray(q.options) ? q.options : [],
        selected_answer: submitted ?? null,
        correct_answer: q.correct_answer,
        is_correct: isCorrect,
        explanation: buildFallbackExplanation(q)
      })

      if (debug) {
        debugDetails.push({
          question_id: q.id,
          submitted,
          correct_answer: q.correct_answer,
          is_correct: isCorrect
        })
      }

      
    })

    const total = questions.length
    const percentage = total > 0 ? (score / total) * 100 : 0

    const { error: resultInsertError } = await supabase.from("results").insert([{
      test_id,
      user_id,
      score,
      total,
      percentage
    }])

    if (resultInsertError) {
      return res.status(500).json({ error: resultInsertError.message })
    }

    const { error: testUpdateError } = await supabase
      .from("tests")
      .update({ is_submitted: true })
      .eq("id", test_id)

    if (testUpdateError) {
      return res.status(500).json({ error: testUpdateError.message })
    }

    const responseBody = {
      message: isExpired
        ? "Time expired. Auto submitted."
        : "Submitted successfully",
      score,
      total,
      percentage,
      review
    }

    if (debug) {
      responseBody.debug = {
        now_utc: new Date(now).toISOString(),
        start_time_raw: test.start_time,
        end_time_raw: test.end_time,
        parsed_start_utc: Number.isFinite(parsedStartTime) ? new Date(parsedStartTime).toISOString() : null,
        parsed_end_utc: Number.isFinite(endTime) ? new Date(endTime).toISOString() : null,
        is_expired: isExpired,
        answer_match_count: debugDetails.filter(item => item.is_correct).length,
        answer_details: debugDetails
      }
    }

    res.json(responseBody)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}