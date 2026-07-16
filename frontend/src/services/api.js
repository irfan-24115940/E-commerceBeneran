import axios from "axios";

// Legacy file kept for compatibility with existing imports.
// It now points to the MistCo backend instead of fakestore.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

