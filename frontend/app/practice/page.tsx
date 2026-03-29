"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTestStore } from "../store/testStore"
import { useAuthStore } from "../store/authStore"
import { motion } from "framer-motion"
import { Brain, Code2 } from "lucide-react"

export default function PracticePage() {
  const router = useRouter()
  const { createTest } = useTestStore()
  const { user, initialized, fetchCurrentUser } = useAuthStore()
  const [creatingType, setCreatingType] = useState<"aptitude" | "coding" | null>(null)
  const [role, setRole] = useState("software engineer")
  const [experience, setExperience] = useState("fresher")
  const [difficulty, setDifficulty] = useState("medium")
  const [formError, setFormError] = useState("")

  useEffect(() => {
    if (!initialized) {
      fetchCurrentUser()
    }
  }, [initialized, fetchCurrentUser])

  const startTest = async (type: "aptitude" | "coding") => {
    setFormError("")

    if (!user?.id) {
      router.push("/login")
      return
    }

    if (!role.trim() || !experience.trim() || !difficulty.trim()) {
      setFormError("Please fill role, experience and difficulty before starting the test.")
      return
    }

    setCreatingType(type)

    try {
      const data = await createTest({
        role: role.trim(),
        experience,
        difficulty
      })

      if (data?.test_id) {
        router.push(`/practice/${type}`)
      }
    } finally {
      setCreatingType(null)
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

        <div className="mb-10 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40">
          <h2 className="text-xl font-semibold mb-4">Set Your Test Preferences</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Role</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Experience</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm"
              >
                <option value="fresher">Fresher</option>
                <option value="intermediate">Intermediate</option>
                <option value="experienced">Experienced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3 py-2 text-sm"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {!initialized && (
            <p className="mt-4 text-sm text-zinc-400">Checking login session...</p>
          )}

          {initialized && !user && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="text-sm text-amber-300">Please log in to start a test.</p>
              <button
                onClick={() => router.push("/login")}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold"
              >
                Go to Login
              </button>
            </div>
          )}

          {initialized && user && (
            <p className="mt-4 text-sm text-emerald-300">Logged in as {user.email}</p>
          )}

          {formError && (
            <p className="mt-4 text-sm text-rose-300">{formError}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Aptitude */}
          <motion.div
            whileHover={{ y: -6 }}
            className="p-10 rounded-4xl border border-zinc-800 bg-zinc-900/40"
          >
            <Brain size={40} className="text-indigo-400 mb-6" />
            <h2 className="text-2xl font-bold mb-3">Aptitude Test</h2>
            <p className="text-zinc-400 mb-8">
              Quantitative, Logical & Verbal in single timer.
            </p>

            <button
              onClick={() => startTest("aptitude")}
              disabled={creatingType !== null || !initialized || !user}
              className="px-6 py-3 bg-indigo-500/20 border border-indigo-500/30 
              hover:bg-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-indigo-300 font-semibold inline-flex items-center gap-2"
            >
              {creatingType === "aptitude" ? (
                <>
                  <span className="h-4 w-4 border-2 border-indigo-300/40 border-t-indigo-300 rounded-full animate-spin" />
                  Your test is being created...
                </>
              ) : (
                "Start Aptitude"
              )}
            </button>
          </motion.div>

          {/* Coding */}
          <motion.div
            whileHover={{ y: -6 }}
            className="p-10 rounded-4xl border border-zinc-800 bg-zinc-900/40"
          >
            <Code2 size={40} className="text-emerald-400 mb-6" />
            <h2 className="text-2xl font-bold mb-3">Coding Practice</h2>
            <p className="text-zinc-400 mb-8">
              Practice coding problems and improve your skills.
            </p>
            <button
              onClick={() => router.push("/practice/coding")}
              className="px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 
              hover:bg-emerald-500/30 rounded-xl text-emerald-300 font-semibold inline-flex items-center gap-2"
            >
              Open DSA Sheet
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  )
}