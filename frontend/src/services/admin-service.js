/**
 * ============================================
 * FILE: admin-service.js
 * JOBDESK: Admin Dashboard Service
 * ============================================
 */

// Mengambil statistik dashboard dari PostgreSQL via API

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const getAuthHeaders = () => {
  const userStr = localStorage.getItem('mist_user');
  if (userStr) {
    const user = JSON.parse(userStr);
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    };
  }
  return { 'Content-Type': 'application/json' };
};

/**
 * Ambil statistik dashboard dari backend
 * GET /admin/dashboard
 */
export const getDashboardStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (response.status === 401) {
      console.warn('Admin Dashboard: Not authorized');
      return null;
    }

    const data = await response.json();
    if (response.ok && data.success) {
      console.log('Dashboard Stats Fetched');
      return data.data.stats;
    }
    return null;
  } catch (error) {
    console.error('Fetch dashboard stats error:', error);
    return null;
  }
};
