/**
 * ============================================
 * FILE: admin-api.js
 * Admin API helper - semua request ke /admin/*
 * Menggunakan VITE_API_BASE_URL dari environment
 * ============================================
 */

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

function getAuthHeaders() {
  const userStr = localStorage.getItem('user') || localStorage.getItem('mist_user');
  if (userStr) {
    try {
      const u = JSON.parse(userStr);
      if (u?.token) {
        return {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${u.token}`,
        };
      }
    } catch (_) { /* ignore */ }
  }
  return { 'Content-Type': 'application/json' };
}

async function request(method, path, body) {
  const opts = {
    method,
    headers: getAuthHeaders(),
  };
  if (body !== undefined) {
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(`${BASE}${path}`, opts);
  const json = await res.json();
  if (!res.ok) {
    const msg = json?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json?.data;
}

// ── Dashboard ─────────────────────────────────────────────
export const fetchDashboard = () => request('GET', '/admin/dashboard');

// ── Reports ───────────────────────────────────────────────
export const fetchReports = () => request('GET', '/admin/reports');

// ── Products ──────────────────────────────────────────────
export const fetchAdminProducts  = ()         => request('GET',    '/admin/products');
export const createProduct       = (data)     => request('POST',   '/admin/products',     data);
export const updateProduct       = (id, data) => request('PUT',    `/admin/products/${id}`, data);
export const deleteProduct       = (id)       => request('DELETE', `/admin/products/${id}`);

// ── Categories ────────────────────────────────────────────
export const fetchAdminCategories = ()         => request('GET',    '/admin/categories');
export const createCategory        = (data)     => request('POST',   '/admin/categories',       data);
export const updateCategory        = (id, data) => request('PUT',    `/admin/categories/${id}`, data);
export const deleteCategory        = (id)       => request('DELETE', `/admin/categories/${id}`);

// ── Orders ────────────────────────────────────────────────
export const fetchAdminOrders  = ()           => request('GET', '/admin/orders');
export const updateOrderStatus = (id, status) => request('PUT', `/admin/orders/${id}/status`, { status });

// ── Users ─────────────────────────────────────────────────
export const fetchAdminUsers = ()           => request('GET', '/admin/users');
export const updateUserRole  = (id, role)   => request('PUT', `/admin/users/${id}`,   { role });
