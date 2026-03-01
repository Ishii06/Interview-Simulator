import { create } from "zustand";

export const useInterviewStore = create((set) => ({
  question: null,
  audioUrl: null,
  loading: false,

  generateQuestion: async (payload) => {
    set({ loading: true });
    const res = await fetch("http://localhost:5000/api/interview/question", {
      method: "POST",
      credentials: "include", // 🔥 cookie auto sent
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      set({ loading: false });
      throw new Error(data.error);
    }
    set({
      question: data.questionText,
      audioUrl: data.audioUrl,
      loading: false,
    });
  },
}));