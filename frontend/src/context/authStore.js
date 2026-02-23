import { create } from "zustand";
import api from "../service/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  //register
  register: async (data) => {
    try {
      set({ loading: true, error: null });
      await api.post("/auth/register", data);
      set({ loading: false });
      return true;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Registration failed",
      });
      return false;
    }
  },

  // login
  login: async (data) => {
    try {
      set({ loading: true, error: null });
      await api.post("/auth/login", data);
      const success = await get().fetchMe();
      return success;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Login failed",
      });
      return false;
    }
  },

  // logout
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  // auth me
  fetchMe: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/auth/me");
      set({
        user: res.data,
        isAuthenticated: true,
        loading: false,
      });
      return true;
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
      return false;
    }
  },
}));