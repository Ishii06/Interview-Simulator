"use client"

import { create } from "zustand"

const API_BASE = "http://localhost:5000" // your Node backend

export const useTestStore = create((set, get) => ({
  // =========================
  // STATE
  // =========================
  userId: null,
  testId: null,
  endTime: null,
  questions: [],
  result: null,
  loading: false,
  error: null,

  // =========================
  // ACTIONS
  // =========================

  setUserId: (id) => set({ userId: id }),

  // 🔥 Create Test
  createTest: async (payload) => {
    set({ loading: true, error: null })

    try {
      const res = await fetch(`${API_BASE}/api/tests/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to create test")
      }

      set({
        userId: payload?.user_id ?? null,
        testId: data.test_id,
        endTime: data.end_time,
        loading: false,
      })

      return data
    } catch (err) {
      set({ error: err?.message || "Failed to create test", loading: false })
      return null
    }
  },

  // 🔥 Fetch Questions
  fetchQuestions: async () => {
    const { testId } = get()

    if (!testId) return

    set({ loading: true })

    try {
      const res = await fetch(`${API_BASE}/api/questions/${testId}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch questions")
      }

      set({
        questions: data,
        loading: false,
      })
    } catch (err) {
      set({ error: err?.message || "Failed to fetch questions", loading: false })
    }
  },

  // 🔥 Submit Test
  submitTest: async (answers) => {
    const { testId, userId } = get()

    if (!testId || !userId) {
      set({
        error: "Missing test or user context. Please start a new test.",
        loading: false,
      })
      return null
    }

    set({ loading: true })

    try {
      const res = await fetch(`${API_BASE}/api/results/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          test_id: testId,
          user_id: userId,
          answers,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || data.message || "Submit failed")
      }

      set({
        result: data,
        loading: false,
      })

      return data
    } catch (err) {
      set({ error: err?.message || "Failed to submit test", loading: false })
      return null
    }
  },

  resetTest: () =>
    set({
      testId: null,
      questions: [],
      result: null,
      error: null,
    }),
}))