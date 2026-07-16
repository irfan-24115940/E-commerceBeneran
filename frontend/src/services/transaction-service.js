/**
 * Service untuk mengelola data transaksi pesanan via PostgreSQL
 */

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

export const saveTransaction = async (transactionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(transactionData)
    });

    const data = await response.json();
    if (response.ok && data.success) {
      console.log('Order Created');
      
      // If there's a payment step simulating success:
      const orderId = data.data.order.id;
      if (transactionData.paymentMethod !== 'COD') {
        await processPayment(orderId);
      }

      return data.data.order;
    }
    return null;
  } catch (error) {
    console.error("Save transaction error:", error);
    return null;
  }
};

export const processPayment = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderId, status: 'success', paymentId: `PAY-${Date.now()}` })
    });

    const data = await response.json();
    if (response.ok && data.success) {
      console.log('Payment Created');
      return true;
    }
    return false;
  } catch (error) {
    console.error("Process payment error:", error);
    return false;
  }
};

export const getTransactions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (response.status === 401) {
      return []; // Not logged in
    }

    const data = await response.json();
    if (response.ok && data.success) {
      console.log('Orders Fetched');
      return data.data.orders || [];
    }
    return [];
  } catch (error) {
    console.error("Get transactions error:", error);
    return [];
  }
};

export const generateInvoiceId = () => {
  const date = new Date();
  const dateStr = date.getFullYear().toString() + 
                  (date.getMonth() + 1).toString().padStart(2, '0') + 
                  date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `#INV-${dateStr}-${random}`;
};
