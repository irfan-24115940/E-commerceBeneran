/**
 * ============================================
 * FILE: auth-service.js
 * ASSIGNED TO: Muhammad Irfan Amelianso (24.11.5940)
 * JOBDESK: Login dan Register Service
 * ============================================
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
export const register = async (email, password, name) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    console.log('Response API (Register):', data);

    if (response.ok && data.success) {
      const user = {
        email: data.data.user.email,
        name: data.data.user.name,
        role: data.data.user.role,
        isLoggedIn: true,
        token: data.data.token
      };
      localStorage.setItem('mist_user', JSON.stringify(user));
      window.dispatchEvent(new Event('authUpdated'));
      return { success: true, message: data.message || 'Register success' };
    }
    return { success: false, message: data.message || 'Gagal registrasi' };
  } catch (error) {
    console.error("Register error:", error);
    return { success: false, message: 'Gagal terhubung ke server' };
  }
};

export const login = async (email, password) => {
  if (!email || !password) return false;
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    console.log('Response API (Login):', data);

    if (response.ok && data.success) {
      const user = {
        email: data.data.user.email,
        name: data.data.user.name,
        role: data.data.user.role,
        isLoggedIn: true,
        token: data.data.token
      };
      localStorage.setItem('mist_user', JSON.stringify(user));
      window.dispatchEvent(new Event('authUpdated'));
      console.log('JWT Response:', data.data.token);
      return { success: true, message: data.message || 'Login success' };
    }
    return { success: false, message: data.message || 'Gagal login' };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: 'Gagal terhubung ke server' };
  }
};

export const logout = () => {
  localStorage.removeItem('mist_user');
  window.dispatchEvent(new Event('authUpdated'));
};

export const getUser = () => {
  const user = localStorage.getItem('mist_user');
  return user ? JSON.parse(user) : null;
};

export const isLoggedIn = () => {
  return getUser() !== null;
};
