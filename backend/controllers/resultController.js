import { supabase } from '../config/supabaseClient.js'

export const submitTest = async (req, res) => {
  try {
    const { test_id, user_id, answers } = req.body

    // 1️⃣ Fetch test
    const { data: test, error: testError } = await supabase
      .from('tests')
      .select('*')
      .eq('id', test_id)
      .single()

    if (testError || !test) {
      return res.status(404).json({ message: "Test not found" })
    }

    if (test.is_submitted) {
      return res.status(400).json({ message: "Test already submitted" })
    }

    // 2️⃣ Check time limit
    const now = new Date()
    const startTime = new Date(test.start_time)

    const timeElapsedMinutes =
      (now - startTime) / (1000 * 60)

    const isExpired = timeElapsedMinutes > test.duration

    // 3️⃣ Fetch questions
    const { data: questions, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .eq('test_id', test_id)

    if (questionError) throw questionError

    // 4️⃣ Calculate score
    let score = 0

    questions.forEach(q => {
      if (answers && answers[q.id] === q.correct_answer) {
        score++
      }
    })

    // 5️⃣ Save result
    const { error: resultError } = await supabase
      .from('results')
      .insert([{
        test_id,
        user_id,
        score,
        total: questions.length
      }])

    if (resultError) throw resultError

    // 6️⃣ Mark test submitted
    const { error: updateError } = await supabase
      .from('tests')
      .update({
        is_submitted: true,
        end_time: new Date()
      })
      .eq('id', test_id)

    if (updateError) throw updateError

    res.json({
      message: isExpired
        ? "Time expired. Test auto-submitted."
        : "Test submitted successfully",
      score,
      total: questions.length
    })

  } catch (error) {
    console.error("Submit error:", error)
    res.status(500).json({ error: error.message })
  }
}
