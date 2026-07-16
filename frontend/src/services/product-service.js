/**
 * ============================================
 * FILE: product-service.js
 * ============================================
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
export const getProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('Products Fetch Success:', data);

    if (response.ok && data.success) {
      return data.data.products;
    }
    return [];
  } catch (error) {
    console.error("Fetch products error:", error);
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log(`Product ${id} Fetch Success:`, data);

    if (response.ok && data.success) {
      return data.data.product;
    }
    return null;
  } catch (error) {
    console.error(`Fetch product ${id} error:`, error);
    return null;
  }
};
