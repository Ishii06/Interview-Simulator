import {create} from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  login: async (email, password) => {
    set({ loading: true });
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      credentials: "include", // 🔥 important for cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      set({ loading: false });
      throw new Error(data.error);
    }
    set({ user: data.user, loading: false });
  },

  logout: async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    set({ user: null });
  },

  setUser: (user) => set({ user }),
}));