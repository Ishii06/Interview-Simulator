import { create } from "zustand"

const API = "http://localhost:5000/api"

export const useTestStore = create((set, get) => ({
  testId: null,
  questions: [],
  duration: 0,
  startTime: null,
  loading: false,

  // ✅ Create Test
  createTest: async ({ user_id, type, role, difficulty }) => {
    set({ loading: true })

    try {
      const res = await fetch(`${API}/tests/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, type, role, difficulty })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      set({ testId: data.test_id })

      return data.test_id
    } catch (err) {
      console.error(err)
    } finally {
      set({ loading: false })
    }
  },

  // ✅ Fetch Test By ID
  fetchTest: async (testId) => {
    set({ loading: true })

    try {
      const res = await fetch(`${API}/tests/${testId}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.message)

      set({
        questions: data.questions,
        duration: data.duration,
        startTime: data.start_time
      })
    } catch (err) {
      console.error(err)
    } finally {
      set({ loading: false })
    }
  },

  // ✅ Submit Test
  submitTest: async (answers, user_id) => {
    const { testId } = get()

    try {
      const res = await fetch(`${API}/results/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          test_id: testId,
          user_id,
          answers
        })
      })

      return await res.json()
    } catch (err) {
      console.error(err)
    }
  }
}))