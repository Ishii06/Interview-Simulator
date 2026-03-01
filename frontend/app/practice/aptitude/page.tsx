"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTestStore } from "../store/testStore"

export default function AptitudeTestPage() {
  const { id } = useParams()
  const router = useRouter()
  const { fetchTest, questions, duration, startTime, submitTest } = useTestStore()

  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    fetchTest(id)
  }, [id])

  useEffect(() => {
    if (startTime && duration) {
      const start = new Date(startTime)
      const end = new Date(start.getTime() + duration * 60000)

      const interval = setInterval(() => {
        const remaining = Math.floor((end - new Date()) / 1000)
        setTimeLeft(remaining > 0 ? remaining : 0)

        if (remaining <= 0) {
          clearInterval(interval)
          handleSubmit()
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [startTime])

  const handleSubmit = async () => {
    const result = await submitTest(
      answers,
      "11111111-1111-1111-1111-111111111111"
    )
    router.push("/practice/result")
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

      {questions.map((q, i) => (
        <div key={q.id} className="mb-8 p-6 bg-zinc-900 rounded-xl">
          <p className="mb-4 font-semibold">
            {i + 1}. {q.question}
          </p>

          {q.options.map((opt, idx) => (
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
        className="px-6 py-3 bg-indigo-600 rounded-xl"
      >
        Submit Test
      </button>
    </div>
  )
}