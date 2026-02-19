import axios from "axios";
import { store } from "../store/index.js";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// attach token if present
api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
