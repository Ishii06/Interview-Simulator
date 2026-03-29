"use client"
import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useTestStore } from "../../store/testStore"
import { Clock, ChevronRight } from "lucide-react"

type TestQuestion = {
  id: string
  question: string
  options: string[]
  section?: string
}

const SECTION_CONFIG = {
  verbal: { label: "Verbal", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  quantitative: { label: "Quantitative", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  logical: { label: "Logical", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" }
}

export default function AptitudeTestPage() {
  const router = useRouter()
  const { testId, endTime, questions, fetchQuestions, submitTest, loading, error } = useTestStore()

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("verbal")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  useEffect(() => {
    if (testId && questions.length === 0) {
      fetchQuestions()
    }
  }, [testId, questions.length, fetchQuestions])

  // Organize questions by section
  const questionsBySection = useMemo(() => {
    const sections = {
      verbal: (questions as TestQuestion[]).filter(q => (q.section || "verbal").toLowerCase() === "verbal"),
      quantitative: (questions as TestQuestion[]).filter(q => (q.section || "numerical").toLowerCase() === "numerical"),
      logical: (questions as TestQuestion[]).filter(q => (q.section || "logical").toLowerCase() === "logical")
    }
    return sections
  }, [questions])

  // Get current section questions
  const currentSectionQuestions = questionsBySection[activeSection as keyof typeof questionsBySection] || []
  const currentQuestion = currentSectionQuestions[currentQuestionIndex]
  const sectionOrder = Object.keys(questionsBySection)

  // Calculate section stats
  const sectionStats = useMemo(() => {
    const stats: Record<string, { total: number; answered: number; unanswered: number }> = {}
    Object.entries(questionsBySection).forEach(([section, qs]) => {
      const answered = qs.filter(q => answers[q.id]).length
      stats[section] = {
        total: qs.length,
        answered,
        unanswered: qs.length - answered
      }
    })
    return stats
  }, [questionsBySection, answers])

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
      <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-10">
        <h1 className="text-2xl font-bold mb-4">No active aptitude test</h1>
        <button onClick={() => router.push("/practice")} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl">
          Back to Practice
        </button>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white p-6 md:p-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Loading test...</p>
        </div>
      </div>
    )
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentSectionQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      return
    }

    const currentSectionIndex = sectionOrder.indexOf(activeSection)
    const nextSection = sectionOrder[currentSectionIndex + 1]

    if (nextSection) {
      setActiveSection(nextSection)
      setCurrentQuestionIndex(0)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSectionChange = (section: string) => {
    setActiveSection(section)
    setCurrentQuestionIndex(0)
  }

  const totalQuestionsAnswered = Object.values(sectionStats).reduce((sum, s) => sum + s.answered, 0)
  const totalQuestions = Object.values(sectionStats).reduce((sum, s) => sum + s.total, 0)

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-800/50 px-4 md:px-6 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg md:text-xl font-semibold tracking-tight text-zinc-100">Aptitude Test</h1>
            <p className="text-[11px] md:text-xs text-zinc-500 mt-1">Progress: {totalQuestionsAnswered} of {totalQuestions} answered</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
              <Clock size={14} className="text-amber-400" />
              <span className="text-sm md:text-base font-mono font-medium text-zinc-100">
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-5">
        {/* Section Cards */}
        <div className="grid md:grid-cols-3 gap-3 mb-5">
          {Object.entries(SECTION_CONFIG).map(([key, config]) => {
            const stats = sectionStats[key]
            const isActive = activeSection === key
            return (
              <button
                key={key}
                onClick={() => handleSectionChange(key)}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${
                  isActive
                    ? `${config.bg} ${config.border} border-2 shadow-lg`
                    : "bg-zinc-900/40 border-zinc-700/50 hover:border-zinc-600"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-sm md:text-base font-semibold tracking-tight ${config.color}`}>{config.label}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-zinc-800">{stats.total} Qs</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs md:text-sm mb-1">
                    <span className="text-emerald-400 font-medium">{stats.answered} answered</span>
                    <span className="text-zinc-500">{stats.unanswered} remaining</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${config.color.replace("text-", "bg-")} transition-all`}
                      style={{ width: `${(stats.answered / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Main Question Area */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 md:p-6 mb-4">
          {/* Section Label */}
          <div className="mb-4 flex items-center gap-2">
            <span className={`text-[11px] md:text-xs font-medium px-2.5 py-1 rounded-full ${SECTION_CONFIG[activeSection as keyof typeof SECTION_CONFIG].bg} ${SECTION_CONFIG[activeSection as keyof typeof SECTION_CONFIG].color}`}>
              {SECTION_CONFIG[activeSection as keyof typeof SECTION_CONFIG].label}
            </span>
            <span className="text-[11px] md:text-xs text-zinc-500">
              Question {currentQuestionIndex + 1} of {currentSectionQuestions.length}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-base md:text-lg font-medium mb-5 leading-relaxed text-zinc-200 tracking-tight">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-2.5 mb-6">
            {currentQuestion.options.map((opt: string, idx: number) => (
              <label
                key={idx}
                className={`group flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  answers[currentQuestion.id] === opt
                    ? "bg-indigo-500/20 border-indigo-500"
                    : "bg-zinc-800/30 border-zinc-700/50 hover:border-zinc-600 hover:bg-zinc-800/50"
                }`}
              >
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={opt}
                  checked={answers[currentQuestion.id] === opt}
                  onChange={() =>
                    setAnswers(prev => ({ ...prev, [currentQuestion.id]: opt }))
                  }
                  className="mt-1 w-4 h-4 accent-indigo-500 cursor-pointer"
                />
                <span className="text-sm md:text-[15px] text-zinc-300 group-hover:text-zinc-100 transition leading-relaxed">{opt}</span>
              </label>
            ))}
          </div>

          {error && <p className="mb-4 text-red-400 text-sm bg-red-500/10 p-2.5 rounded-lg">{error}</p>}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-3">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs md:text-sm font-medium"
          >
            Previous
          </button>

          <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all"
              style={{
                width: `${((currentQuestionIndex + 1) / currentSectionQuestions.length) * 100}%`
              }}
            />
          </div>

          <button
            onClick={handleNextQuestion}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition text-xs md:text-sm font-medium inline-flex items-center gap-2"
          >
            {currentQuestionIndex === currentSectionQuestions.length - 1 && sectionOrder.indexOf(activeSection) < sectionOrder.length - 1
              ? "Next Section"
              : "Next"}
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Submit Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || loading}
            className="px-5 py-2 rounded-lg font-medium transition inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
          >
            {isSubmitting ? "Submitting..." : `Submit (${totalQuestionsAnswered}/${totalQuestions})`}
          </button>
        </div>
      </div>
    </div>
  )
}