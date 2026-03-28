"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTestStore } from "../../store/testStore"

type TestQuestion = {
  id: string
  question: string
  options: string[]
}

export default function AptitudeTestPage() {
  const router = useRouter()
  const { testId, endTime, questions, fetchQuestions, submitTest, loading, error } = useTestStore()

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (testId && questions.length === 0) {
      fetchQuestions()
    }
  }, [testId, questions.length, fetchQuestions])

  useEffect(() => {
    if (endTime) {
      const end = new Date(endTime)

      const interval = setInterval(() => {
        const remaining = Math.floor((end.getTime() - Date.now()) / 1000)
        setTimeLeft(remaining > 0 ? remaining : 0)

        if (remaining <= 0 && !isSubmitting) {
          clearInterval(interval)
          handleSubmit()
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [endTime, isSubmitting])

  const handleSubmit = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    const result = await submitTest(answers)

    if (result) {
      router.push("/practice/aptitude/result")
      return
    }

    setIsSubmitting(false)
  }

  if (!testId) {
    return (
      <div className="min-h-screen bg-black text-white p-10">
        <h1 className="text-2xl font-bold mb-4">No active aptitude test</h1>
        <button onClick={() => router.push("/practice")} className="px-6 py-3 bg-indigo-600 rounded-xl">
          Back to Practice
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="flex justify-between mb-10">
        <h1 className="text-2xl font-bold">Aptitude Test</h1>
        <div className="text-red-400 font-bold">
          ⏳ {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </div>
      </div>

      {loading && <p className="mb-6 text-zinc-300">Loading questions...</p>}
      {error && <p className="mb-6 text-red-400">{error}</p>}

      {(questions as TestQuestion[]).map((q, i) => (
        <div key={q.id} className="mb-8 p-6 bg-zinc-900 rounded-xl">
          <p className="mb-4 font-semibold">
            {i + 1}. {q.question}
          </p>

          {q.options.map((opt: string, idx: number) => (
            <label key={idx} className="block mb-2">
              <input
                type="radio"
                name={q.id}
                value={opt}
                onChange={() =>
                  setAnswers(prev => ({ ...prev, [q.id]: opt }))
                }
              />{" "}
              {opt}
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || loading}
        className="px-6 py-3 bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl"
      >
        {isSubmitting ? "Submitting..." : "Submit Test"}
      </button>
    </div>
  )
}