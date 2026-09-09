import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { TOKEN_STORAGE_KEY } from "../api/client";
import { fetchCurrentAdmin } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    fetchCurrentAdmin()
      .then(setAdmin)
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback((token, adminData) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    setAdmin(adminData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
