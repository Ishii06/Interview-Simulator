"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { useTestStore } from "../../../store/testStore"
import { ChevronDown } from "lucide-react"

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
  const [openExplanations, setOpenExplanations] = useState<Record<string, boolean>>({})

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

  const toggleExplanation = (key: string) => {
    setOpenExplanations((previous) => ({
      ...previous,
      [key]: !previous[key],
    }))
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
    <div className="mt-20 min-h-screen bg-black text-white px-6 py-8 md:px-10 md:py-10" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/60">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2 text-zinc-100">Aptitude Test Result</h1>
          <p className="text-sm md:text-base text-zinc-400 mb-5">Your test has been submitted successfully.</p>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-3.5">
              <p className="text-zinc-500 text-xs mb-1 uppercase tracking-wide">Score</p>
              <p className="text-xl font-semibold text-zinc-100">{score}/{total}</p>
            </div>
            <div className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-3.5">
              <p className="text-zinc-500 text-xs mb-1 uppercase tracking-wide">Percentage</p>
              <p className="text-xl font-semibold text-zinc-100">{percentage.toFixed(2)}%</p>
            </div>
            <div className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-3.5">
              <p className="text-zinc-500 text-xs mb-1 uppercase tracking-wide">Correct Answers</p>
              <p className="text-xl font-semibold text-zinc-100">{score}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {review.map((item, index) => (
            <div
              key={`${item.question_id}-${index}`}
              className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/40"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2.5">
                <p className="font-medium text-sm md:text-base leading-snug flex-1 min-w-0 text-zinc-100">Q{index + 1}. {item.question}</p>
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
                <p className="text-[11px] uppercase tracking-wide text-zinc-500 mb-2.5">{item.section}</p>
              )}

              <p className="text-zinc-300 mb-1 text-sm">
                <span className="text-zinc-500">Your answer:</span>{" "}
                {item.selected_answer || "Not answered"}
              </p>
              <p className="text-emerald-300 mb-3 text-sm">
                <span className="text-zinc-500">Correct answer:</span>{" "}
                {item.correct_answer}
              </p>

              <button
                onClick={() => toggleExplanation(`${item.question_id}-${index}`)}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-950/50 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900 transition"
              >
                <ChevronDown
                  size={14}
                  className={`transition-transform ${openExplanations[`${item.question_id}-${index}`] ? "rotate-180" : "rotate-0"}`}
                />
                {openExplanations[`${item.question_id}-${index}`] ? "Hide explanation" : "Show explanation"}
              </button>

              {openExplanations[`${item.question_id}-${index}`] && (
                <p className="mt-3 max-w-2xl text-sm text-zinc-300 leading-relaxed">
                  <span className="text-zinc-500">Explanation:</span>{" "}
                  {item.explanation}
                </p>
              )}
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
