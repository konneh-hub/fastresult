import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string, role: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post("/auth/login", {
          email,
          password,
          role
        });

        if (response.data && response.data.token) {
          const { token, user } = response.data;
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          setToken(token);
          setUser(user);
          return { success: true, user };
        }
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || "Login failed";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setToken(null);
    setUser(null);
    navigate("/login");
  }, [navigate]);

  const isAuthenticated = !!token && !!user;

  return {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated
  };
}
