/**
 * ============================================
 * FILE: cart-service.js
 * ASSIGNED TO: Muhammad Dhani Favian (24.11.5944)
 * JOBDESK: Halaman Kranjang Service
 * ============================================
 */

// Menyimpan dan mengelola data keranjang via PostgreSQL

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const getAuthHeaders = () => {
  const userStr = localStorage.getItem('mist_user');
  if (userStr) {
    const user = JSON.parse(userStr);
    console.log("📍 [CART] Auth Headers:", {
      hasToken: !!user.token,
      tokenLength: user.token?.length || 0
    });
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    };
  }
  console.warn("⚠️ [CART] No user found in localStorage - request will be unauthorized");
  return { 'Content-Type': 'application/json' };
};

export const getCart = async () => {
  try {
    console.log("🔄 [CART] Fetching cart from server...");
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (response.status === 401) {
      console.warn("⚠️ [CART] Unauthorized (401) - User not logged in or token expired");
      return [];
    }

    if (response.status === 404) {
      console.warn("⚠️ [CART] Not found (404)");
      return [];
    }

    const data = await response.json();
    console.log("📦 [CART] Response:", { status: response.status, success: data.success, itemCount: data.data?.cart?.items?.length || 0 });
    
    if (response.ok && data.success) {
      console.log('✅ [CART] Cart Fetch Success -', data.data.cart.items.length, 'items');
      return data.data.cart.items || [];
    }
    console.error("❌ [CART] Failed to fetch cart:", data.message);
    return [];
  } catch (error) {
    console.error("❌ [CART] Fetch cart error:", error);
    return [];
  }
};

export const addToCart = async (product, quantity = 1) => {
  try {
    console.log("🛒 [CART] Adding to cart:", { productId: product.id, title: product.title, quantity });
    const response = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId: product.id, quantity })
    });

    const data = await response.json();
    console.log("📡 [CART] Response status:", response.status, "success:", data.success);
    
    if (response.status === 401) {
      console.error("❌ [CART] Unauthorized (401) - Cannot add item without valid token");
      return false;
    }

    if (response.ok && data.success) {
      console.log('✅ [CART] Cart Item Added - Product:', product.title);
      window.dispatchEvent(new Event('cartUpdated'));
      return true;
    }
    console.error("❌ [CART] Failed to add item:", data.message);
    return false;
  } catch (error) {
    console.error("❌ [CART] Add cart error:", error);
    return false;
  }
};

export const updateQuantity = async (productId, newQuantity) => {
  if (newQuantity < 1) {
    console.warn("⚠️ [CART] Invalid quantity:", newQuantity);
    return false;
  }
  try {
    console.log("📝 [CART] Updating quantity - Product ID:", productId, "New Qty:", newQuantity);
    const response = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity: newQuantity })
    });

    const data = await response.json();
    if (response.ok && data.success) {
      console.log('✅ [CART] Cart Item Updated');
      window.dispatchEvent(new Event('cartUpdated'));
      return true;
    }
    console.error("❌ [CART] Failed to update quantity:", data.message);
    return false;
  } catch (error) {
    console.error("❌ [CART] Update cart error:", error);
    return false;
  }
};

export const removeFromCart = async (productId) => {
  try {
    console.log("🗑️ [CART] Removing from cart - Product ID:", productId);
    const response = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    if (response.ok && data.success) {
      console.log('✅ [CART] Cart Item Removed');
      window.dispatchEvent(new Event('cartUpdated'));
      return true;
    }
    console.error("❌ [CART] Failed to remove item:", data.message);
    return false;
  } catch (error) {
    console.error("❌ [CART] Remove cart error:", error);
    return false;
  }
};

export const clearCart = async () => {
  try {
    console.log("🧹 [CART] Clearing entire cart...");
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    if (response.ok && data.success) {
      console.log('✅ [CART] Cart Cleared');
      window.dispatchEvent(new Event('cartUpdated'));
      return true;
    }
    console.error("❌ [CART] Failed to clear cart:", data.message);
    return false;
  } catch (error) {
    console.error("❌ [CART] Clear cart error:", error);
    return false;
  }
};
