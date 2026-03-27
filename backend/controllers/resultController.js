import { supabase } from "../config/supabaseClient.js"

export const submitTest = async (req, res) => {
  try {
    const { test_id, user_id, answers } = req.body

    const { data: test, error: testError } = await supabase
      .from("tests")
      .select("*")
      .eq("id", test_id)
      .eq("user_id", user_id)
      .maybeSingle()

    if (testError) {
      return res.status(500).json({ error: testError.message })
    }

    if (!test) {
      return res.status(404).json({ message: "Test not found" })
    }

    if (test.is_submitted) {
      return res.status(400).json({ message: "Already submitted" })
    }

    const now = Date.now()
    const endTime = new Date(test.end_time).getTime()
    const isExpired = now > endTime

    const { data: questions, error: qError } = await supabase
      .from("questions")
      .select("*")
      .eq("test_id", test_id)

    if (qError) {
      return res.status(500).json({ error: qError.message })
    }

    let score = 0

    questions.forEach(q => {
      if (answers?.[q.id] === q.correct_answer) {
        score++
      }
    })

    const total = questions.length
    const percentage = total > 0 ? (score / total) * 100 : 0

    await supabase.from("results").insert([{
      test_id,
      user_id,
      score,
      total,
      percentage
    }])

    await supabase
      .from("tests")
      .update({ is_submitted: true })
      .eq("id", test_id)

    res.json({
      message: isExpired
        ? "Time expired. Auto submitted."
        : "Submitted successfully",
      score,
      total,
      percentage
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}