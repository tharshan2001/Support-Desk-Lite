// src/store/authStore.js
import { create } from "zustand";
import api from "../service/api.js";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  register: async (data) => {
    try {
      set({ loading: true, error: null });
      await api.post("/auth/register", data);
      set({ loading: false });
      return true;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Register failed",
      });
      return false;
    }
  },

  login: async (data) => {
    try {
      set({ loading: true, error: null });
      await api.post("/auth/login", data);
      await get().fetchMe();
      return true;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Login failed",
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/auth/me");
      set({
        user: res.data,
        isAuthenticated: true,
        loading: false,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },
}));
