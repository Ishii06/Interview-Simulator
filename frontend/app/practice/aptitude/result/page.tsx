"use client"

import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { useTestStore } from "../../../store/testStore"

type ReviewItem = {
  question_id: string | number
  section?: string | null
  question: string
  options: string[]
  selected_answer: string | null
  correct_answer: string
  is_correct: boolean
  explanation: string
}

export default function AptitudeResultPage() {
  const router = useRouter()
  const { result, resetTest } = useTestStore()

  const percentage = useMemo(() => {
    if (!result) return 0
    if (typeof result.percentage === "number") return result.percentage

    const score = Number(result.score || 0)
    const total = Number(result.total || 0)
    return total > 0 ? (score / total) * 100 : 0
  }, [result])

  const review = useMemo(() => {
    if (!result || !Array.isArray(result.review)) return []
    return result.review as ReviewItem[]
  }, [result])

  const handleBackToPractice = () => {
    resetTest()
    router.push("/practice")
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-black text-white p-8 md:p-12">
        <div className="max-w-4xl mx-auto p-8 rounded-2xl border border-zinc-800 bg-zinc-900/60">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">No result found</h1>
          <p className="text-zinc-400 mb-6">
            Submit an aptitude test first to view your score and detailed answer review.
          </p>
          <button
            onClick={() => router.push("/practice")}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500"
          >
            Back to Practice
          </button>
        </div>
      </div>
    )
  }

  const score = Number(result.score || 0)
  const total = Number(result.total || 0)

  return (
    <div className="mt-20 min-h-screen bg-black text-white p-8 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/60">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Aptitude Test Result</h1>
          <p className="text-zinc-400 mb-6">Your test has been submitted successfully.</p>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-4">
              <p className="text-zinc-400 text-sm mb-1">Score</p>
              <p className="text-2xl font-bold">{score}/{total}</p>
            </div>
            <div className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-4">
              <p className="text-zinc-400 text-sm mb-1">Percentage</p>
              <p className="text-2xl font-bold">{percentage.toFixed(2)}%</p>
            </div>
            <div className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-4">
              <p className="text-zinc-400 text-sm mb-1">Correct Answers</p>
              <p className="text-2xl font-bold">{score}</p>
            </div>
          </div>
        </div>

        <div className="space-y-5 mb-8">
          {review.map((item, index) => (
            <div
              key={`${item.question_id}-${index}`}
              className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40"
            >
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <p className="font-semibold text-lg">Q{index + 1}. {item.question}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${
                    item.is_correct
                      ? "text-emerald-300 border-emerald-500/50 bg-emerald-500/10"
                      : "text-rose-300 border-rose-500/50 bg-rose-500/10"
                  }`}
                >
                  {item.is_correct ? "Correct" : "Incorrect"}
                </span>
              </div>

              {item.section && (
                <p className="text-xs uppercase tracking-wide text-zinc-500 mb-3">{item.section}</p>
              )}

              <p className="text-zinc-300 mb-1">
                <span className="text-zinc-500">Your answer:</span>{" "}
                {item.selected_answer || "Not answered"}
              </p>
              <p className="text-emerald-300 mb-3">
                <span className="text-zinc-500">Correct answer:</span>{" "}
                {item.correct_answer}
              </p>

              <p className="text-zinc-300">
                <span className="text-zinc-500">Explanation:</span>{" "}
                {item.explanation}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={handleBackToPractice}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500"
        >
          Back to Practice Tests
        </button>
      </div>
    </div>
  )
}
