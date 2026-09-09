import axios from "axios";

const TOKEN_STORAGE_KEY = "sms_token";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { TOKEN_STORAGE_KEY };

// Surface a clean error message everywhere the API is called.
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message || err.message || "Request failed.";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
