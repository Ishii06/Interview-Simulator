"use client"
import { useRouter } from "next/navigation"
import { useTestStore } from "../store/testStore"
import { motion } from "framer-motion"
import { Brain, Code2 } from "lucide-react"

export default function PracticePage() {
  const router = useRouter()
  const { createTest } = useTestStore()

  const startTest = async (type) => {
    const testId = await createTest({
      user_id: "11111111-1111-1111-1111-111111111111", // replace later
      type,
      role: "software engineer",
      difficulty: "medium"
    })

    if (testId) {
      router.push(`/practice/${type}/${testId}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 px-8 py-20">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-16"
        >
          Practice Tests
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Aptitude */}
          <motion.div
            whileHover={{ y: -6 }}
            className="p-10 rounded-[2rem] border border-zinc-800 bg-zinc-900/40"
          >
            <Brain size={40} className="text-indigo-400 mb-6" />
            <h2 className="text-2xl font-bold mb-3">Aptitude Test</h2>
            <p className="text-zinc-400 mb-8">
              Quantitative, Logical & Verbal in single timer.
            </p>

            <button
              onClick={() => startTest("aptitude")}
              className="px-6 py-3 bg-indigo-500/20 border border-indigo-500/30 
              hover:bg-indigo-500/30 rounded-xl text-indigo-300 font-semibold"
            >
              Start Aptitude
            </button>
          </motion.div>

          {/* Coding */}
          <motion.div
            whileHover={{ y: -6 }}
            className="p-10 rounded-[2rem] border border-zinc-800 bg-zinc-900/40"
          >
            <Code2 size={40} className="text-emerald-400 mb-6" />
            <h2 className="text-2xl font-bold mb-3">Coding Test</h2>

            <button
              onClick={() => startTest("coding")}
              className="px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 
              hover:bg-emerald-500/30 rounded-xl text-emerald-300 font-semibold"
            >
              Start Coding
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  )
}