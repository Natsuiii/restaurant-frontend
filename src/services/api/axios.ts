import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const AUTH_STORAGE_KEY = "foody_auth";

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as { token?: string };
          if (parsed.token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${parsed.token}`;
          }
        } catch {
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
