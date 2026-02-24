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

// response interceptor for errors
import { showError } from "../utils/toast.js";
import { logout } from "../store/authSlice.js";

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || err.message || "Unknown error";
    showError(msg);
    // if unauthorized, clear token
    if (err.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(err);
  },
);

export default api;
