import { products } from '../data/products.js';

/**
 * Filter produk berdasarkan pencarian dan kategori
 */
export const searchProducts = (query = '', category = 'all') => {
  let filtered = products;

  // Filter kategori
  if (category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  // Filter pencarian teks
  if (query.trim() !== '') {
    const lowerQuery = query.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    );
  }

  return filtered;
};
