// src/service/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5090/api",
  withCredentials: true, 
});

export default api;
