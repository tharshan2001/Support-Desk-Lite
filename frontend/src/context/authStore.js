// src/context/authStore.js
import { create } from "zustand";
import api from "../service/api"; // your Axios instance

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true, // ✅ start as true to wait for fetchMe
  error: null,

  login: async (data) => {
    try {
      console.log("Login attempt:", data);
      set({ loading: true, error: null });
      await api.post("/auth/login", data);
      const success = await get().fetchMe();
      console.log("Login success, user:", get().user);
      return success;
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      set({
        loading: false,
        error: err.response?.data?.message || "Login failed",
      });
      return false;
    }
  },

  logout: async () => {
    try {
      console.log("Logging out...");
      await api.post("/auth/logout");
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  fetchMe: async () => {
    try {
      console.log("Fetching current user...");
      set({ loading: true });
      const res = await api.get("/auth/me");
      console.log("Fetched user:", res.data);
      set({
        user: res.data,
        isAuthenticated: true,
        loading: false,
      });
      return true;
    } catch (err) {
      console.error("fetchMe failed:", err.response?.data || err.message);
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
      return false;
    }
  },
}));
