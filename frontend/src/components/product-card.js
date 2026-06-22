import { formatRupiah } from '../utils/formatter.js';
import { isInWishlist } from '../services/wishlist-service.js';

/**
 * Komponen untuk merender card produk
 */
export const createProductCard = async (product) => {
  const isWished = await isInWishlist(product.id);
  const heartIcon = isWished ? '❤️' : '🤍';
  
  // Normalisasi nama produk: backend pakai 'title', data lokal pakai 'name'
  const productName = product.title || product.name || 'Produk';

  // Tentukan class layout berdasarkan kategori
  let layoutClass = '';
  const cat = (product.category || '').toLowerCase();
  switch (cat) {
    case 'topi': layoutClass = 'layout-topi'; break;
    case 'workshirt': layoutClass = 'layout-workshirt'; break;
    case 'pakaian-muslim': layoutClass = 'layout-pakaian-muslim'; break;
    case 'hoodie': layoutClass = 'layout-hoodie'; break;
    case 'celana': layoutClass = 'layout-celana'; break;
    case 'kaos': layoutClass = 'layout-kaos'; break;
    default: layoutClass = 'layout-default';
  }

  return `
    <div class="product-card ${layoutClass}">
      <div class="product-img-wrapper">
        <img src="${product.image}" alt="${productName}" loading="lazy">
        <div class="product-badges">
          <span class="badge-new">NEW</span>
        </div>
        <button class="btn-wishlist btn-wishlist-card" data-id="${product.id}" title="Favorit">
          ${heartIcon}
        </button>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-name product-title">${productName}</h3>
        <div class="product-price-row">
          <span class="product-price">${formatRupiah(product.price)}</span>
        </div>
        <div class="product-actions">
          <button class="btn btn-buy-now" data-id="${product.id}">BELI SEKARANG</button>
          <button class="btn btn-add-cart" data-id="${product.id}">+ CART</button>
        </div>
      </div>
    </div>
  `;
};
