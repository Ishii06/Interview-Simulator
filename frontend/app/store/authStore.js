import {create} from 'zustand';

const API_BASE_URL = "http://localhost:5000/api/auth";

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  initialized: false,
  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Login failed");
      }

      set({ user: data.user, loading: false, initialized: true });
      return data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  signup: async ({ email, password, name }) => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Signup failed");
      }

      set({ loading: false, initialized: true });
      return data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    await fetch(`${API_BASE_URL}/logout`, {
      method: "GET",
      credentials: "include",
    });

    set({ user: null, initialized: true });
  },

  fetchCurrentUser: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        set({ user: null, initialized: true });
        return null;
      }

      const data = await res.json();
      set({ user: data?.user || null, initialized: true });
      return data?.user || null;
    } catch {
      set({ user: null, initialized: true });
      return null;
    }
  },

  setUser: (user) => set({ user, initialized: true }),
}));