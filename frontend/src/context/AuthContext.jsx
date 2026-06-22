/**
 * ============================================
 * FILE: AuthContext.jsx
 * ASSIGNED TO: Muhammad Irfan Amelianso (24.11.5940)
 * JOBDESK: Login dan Register
 * ============================================
 */

import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { addToast } = useToast();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("mist_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("mist_user");
    }
  }, [user]);

  const login = async (email, password) => {
    if (!email || !password) {
      addToast("Email atau password salah", "error");
      return false;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.message || 'Login failed');

      const nextUser = {
        ...(json?.data?.user || { name: json?.data?.name || 'John Doe', email }),
        token: json?.data?.token
      };

      setUser(nextUser);
      addToast("Selamat Datang Kembali!", "success");
      window.dispatchEvent(new Event('authUpdated'));
      return true;
    } catch (e) {
      addToast(e?.message || "Email atau password salah", "error");
      return false;
    }
  };

  const register = async (name, email, password) => {
    console.log("API URL =", import.meta.env.VITE_API_BASE_URL);

      console.log({
        name,
        email,
        password
      });
    if (!name || !email || !password) return false;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.message || 'Register failed');

      const nextUser = {
        ...(json?.data?.user || { name, email }),
        token: json?.data?.token
      };

      setUser(nextUser);
      addToast("Akun Berhasil Dibuat!", "success");
      window.dispatchEvent(new Event('authUpdated'));
      return true;
    } catch (e) {
      addToast(e?.message || "Terjadi kesalahan. Coba lagi.", "error");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('mist_token');
    setToken(null);
    setUser(null);
    addToast("Kamu telah keluar", "info");
    window.dispatchEvent(new Event('authUpdated'));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);