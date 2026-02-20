// src/lib/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5090/api",
  withCredentials: true, // 🔥 allows cookies
});

export default api;
