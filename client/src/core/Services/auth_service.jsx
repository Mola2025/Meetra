import { useState, useEffect, createContext, useContext } from "react";
import api from "./api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("meetra_token");
    const saved = localStorage.getItem("meetra_user");
    if (token && saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("meetra_token");
        localStorage.removeItem("meetra_user");
      }
    }
    setLoading(false);
  }, []);

  async function register({ name, email, password }) {
    const data = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    _saveSession(data);
    return data;
  }

  async function login({ email, password }) {
    const data = await api.post("/auth/login", { email, password });
    _saveSession(data);
    return data;
  }

  function logout() {
    localStorage.removeItem("meetra_token");
    localStorage.removeItem("meetra_user");
    setUser(null);
  }

  async function refreshUser() {
    const data = await api.get("/auth/me");
    localStorage.setItem("meetra_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function _saveSession({ token, user }) {
    localStorage.setItem("meetra_token", token);
    localStorage.setItem("meetra_user", JSON.stringify(user));
    setUser(user);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
