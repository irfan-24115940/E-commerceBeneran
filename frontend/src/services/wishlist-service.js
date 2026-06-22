/**
 * ============================================
 * FILE: wishlist-service.js
 * ASSIGNED TO: Andika Cavllo B (24.11.5950)
 * JOBDESK: Halaman Favorit Service
 * ============================================
 */

// Mengelola daftar wishlist via PostgreSQL

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const getAuthHeaders = () => {
  const userStr = localStorage.getItem('mist_user');
  if (userStr) {
    const user = JSON.parse(userStr);
    console.log("📍 [WISHLIST] Auth Headers:", {
      hasToken: !!user.token,
      tokenLength: user.token?.length || 0
    });
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    };
  }
  console.warn("⚠️ [WISHLIST] No user found in localStorage - request will be unauthorized");
  return { 'Content-Type': 'application/json' };
};

export const getWishlist = async () => {
  try {
    console.log("🔄 [WISHLIST] Fetching wishlist from server...");
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (response.status === 401) {
      console.warn("⚠️ [WISHLIST] Unauthorized (401) - User not logged in or token expired");
      return [];
    }

    if (response.status === 404) {
      console.warn("⚠️ [WISHLIST] Not found (404)");
      return [];
    }

    const data = await response.json();
    console.log("❤️ [WISHLIST] Response:", { status: response.status, success: data.success, itemCount: data.data?.wishlist?.items?.length || 0 });
    
    if (response.ok && data.success) {
      console.log('✅ [WISHLIST] Wishlist Fetch Success -', data.data.wishlist.items.length, 'items');
      return data.data.wishlist.items || [];
    }
    console.error("❌ [WISHLIST] Failed to fetch wishlist:", data.message);
    return [];
  } catch (error) {
    console.error("❌ [WISHLIST] Fetch wishlist error:", error);
    return [];
  }
};

export const addToWishlist = async (product) => {
  try {
    console.log("❤️ [WISHLIST] Adding to wishlist:", { productId: product.id, title: product.title });
    const response = await fetch(`${API_BASE_URL}/wishlist/items`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId: product.id })
    });

    const data = await response.json();
    console.log("📡 [WISHLIST] Response status:", response.status, "success:", data.success);
    
    if (response.status === 401) {
      console.error("❌ [WISHLIST] Unauthorized (401) - Cannot add item without valid token");
      return false;
    }

    if (response.ok && data.success) {
      console.log('✅ [WISHLIST] Wishlist Item Added - Product:', product.title);
      window.dispatchEvent(new Event('wishlistUpdated'));
      return true;
    }
    console.error("❌ [WISHLIST] Failed to add item:", data.message);
    return false;
  } catch (error) {
    console.error("❌ [WISHLIST] Add wishlist error:", error);
    return false;
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    console.log("🗑️ [WISHLIST] Removing from wishlist - Product ID:", productId);
    const response = await fetch(`${API_BASE_URL}/wishlist/items/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    if (response.ok && data.success) {
      console.log('✅ [WISHLIST] Wishlist Item Removed');
      window.dispatchEvent(new Event('wishlistUpdated'));
      return true;
    }
    console.error("❌ [WISHLIST] Failed to remove item:", data.message);
    return false;
  } catch (error) {
    console.error("❌ [WISHLIST] Remove wishlist error:", error);
    return false;
  }
};

export const isInWishlist = async (productId) => {
  try {
    console.log(
      "🔍 [WISHLIST] Checking if product is in wishlist - Product ID:",
      productId
    );

    const wishlist = await getWishlist();

    return wishlist.some(
      (item) =>
        item.product_id === productId ||
        item.id === productId
    );
  } catch (error) {
    console.error(
      "❌ [WISHLIST] Check wishlist error:",
      error
    );
    return false;
  }
};

export const toggleWishlist = async (product) => {
  const exists = await isInWishlist(product.id);

  if (exists) {
    return await removeFromWishlist(product.id);
  }

  return await addToWishlist(product);
};