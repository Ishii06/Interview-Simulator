import { supabase } from "../config/supabaseClient.js"
import { generateAnswerExplanation } from "../services/pythonService.js"

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

  return Date.parse(normalized)
}

const normalizeText = (value) => String(value ?? "").trim().toLowerCase()

const normalizeAnswers = (answers) => {
  const normalized = {
    byId: {},
    byQuestion: {},
    byIndex: {},
  }

  if (Array.isArray(answers)) {
    answers.forEach((item, idx) => {
      if (!item || typeof item !== "object") return

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

  if (answers && typeof answers === "object") {
    Object.entries(answers).forEach(([key, value]) => {
      normalized.byId[String(key)] = value
      normalized.byIndex[String(key)] = value
    })
  }

  return normalized
}

const buildFallbackExplanation = (question) => {
  if (question?.explanation && String(question.explanation).trim()) {
    return String(question.explanation).trim()
  }

  const answer = String(question?.correct_answer ?? "").trim()
  if (!answer) {
    return `This question is marked correct for ${question?.section ?? "this section"}.`
  }

  return `The correct answer is "${answer}" because it matches the main idea in the question.`
}

const generateReviewExplanation = async (question, submitted, isCorrect) => {
  try {
    const explanation = await generateAnswerExplanation({
      question: question.question ?? question.question_text ?? "",
      options: Array.isArray(question.options) ? question.options : [],
      correct_answer: question.correct_answer,
      selected_answer: submitted ?? null,
      section: question.section ?? null,
      is_correct: isCorrect,
    })

    if (explanation && String(explanation).trim()) {
      return String(explanation).trim()
    }
  } catch {
    // Fall through to the deterministic fallback below.
  }

  return buildFallbackExplanation(question)
}

export const submitTest = async (req, res) => {
  try {
    const { test_id, answers } = req.body
    const user_id = req.user?.id
    const debug = req.query?.debug === "true"

    if (!user_id) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    if (!test_id) {
      return res.status(400).json({ error: "test_id is required" })
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
      .order("id", { ascending: true })

    if (qError) {
      return res.status(500).json({ error: qError.message })
    }

    const submittedAnswers = normalizeAnswers(answers)
    const debugDetails = []

    const review = await Promise.all((questions || []).map(async (question, idx) => {
      const submitted =
        submittedAnswers.byId[String(question.id)] ??
        submittedAnswers.byQuestion[normalizeText(question.question)] ??
        submittedAnswers.byQuestion[normalizeText(question.question_text)] ??
        submittedAnswers.byIndex[String(idx)]

      const isCorrect = normalizeText(submitted) === normalizeText(question.correct_answer)
      const explanation = await generateReviewExplanation(question, submitted, isCorrect)

      debugDetails.push({
        question_id: question.id,
        submitted,
        correct_answer: question.correct_answer,
        is_correct: isCorrect,
      })

      return {
        question_id: question.id,
        section: question.section ?? null,
        question: question.question ?? question.question_text ?? "",
        options: Array.isArray(question.options) ? question.options : [],
        selected_answer: submitted ?? null,
        correct_answer: question.correct_answer,
        is_correct: isCorrect,
        explanation,
      }
    }))

    const score = review.filter((item) => item.is_correct).length
    const total = questions?.length || 0
    const percentage = total > 0 ? (score / total) * 100 : 0

    const { error: resultInsertError } = await supabase.from("results").insert([{
      test_id,
      user_id,
      score,
      total,
      percentage,
    }])

    if (resultInsertError) {
      return res.status(500).json({ error: resultInsertError.message })
    }

    const { error: testUpdateError } = await supabase
      .from("tests")
      .update({ is_submitted: true })
      .eq("id", test_id)
      .eq("user_id", user_id)

    if (testUpdateError) {
      return res.status(500).json({ error: testUpdateError.message })
    }

    const responseBody = {
      message: isExpired ? "Time expired. Auto submitted." : "Submitted successfully",
      score,
      total,
      percentage,
      review,
    }

    if (debug) {
      responseBody.debug = {
        now_utc: new Date(now).toISOString(),
        start_time_raw: test.start_time,
        end_time_raw: test.end_time,
        parsed_start_utc: Number.isFinite(parsedStartTime) ? new Date(parsedStartTime).toISOString() : null,
        parsed_end_utc: Number.isFinite(endTime) ? new Date(endTime).toISOString() : null,
        is_expired: isExpired,
        answer_match_count: debugDetails.filter((item) => item.is_correct).length,
        answer_details: debugDetails,
      }
    }

    return res.json(responseBody)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}