/**
 * ============================================
 * FILE: ProductCard.jsx
 * ASSIGNED TO: Muhammad Farrukh al ghifari (24.11.5936)
 * JOBDESK: Kategori Celana, Hoodie, dan Topi
 * ============================================
 */

import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatRupiah } from '../data/muslimClothingProducts';
import { useToast } from '../context/ToastContext';

// Star Rating
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= Math.round(rating) ? 'var(--accent)' : 'none'} stroke={s <= Math.round(rating) ? 'var(--accent)' : 'var(--text-muted)'} strokeWidth="2">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToast } = useToast();

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      addToast('Dihapus dari wishlist', 'info');
    } else {
      addToWishlist(product);
      addToast('Ditambahkan ke wishlist', 'success');
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    addToast(`${product.title} telah masuk keranjang!`, 'success');
  };

  return (
    <div className="card group relative flex flex-col overflow-hidden" style={{ background: 'var(--surface)' }}>
      {/* Badge */}
      {product.badge && (
        <div
          className="absolute top-3 left-3 z-10 badge text-xs"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
            color: '#1a1a2e',
          }}
        >
          {product.badge}
        </div>
      )}

      {/* Wishlist Btn */}
      <button
        id={`wishlist-btn-${product.id}`}
        type="button"
        onClick={toggleWishlist}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          background: isWishlisted ? '#ef4444' : 'rgba(255,255,255,0.9)',
          color: isWishlisted ? '#fff' : '#9ca3af',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        }}
        onMouseEnter={(e) => {
          if (!isWishlisted) {
            e.currentTarget.style.background = '#ef4444';
            e.currentTarget.style.color = '#fff';
          }
        }}
        onMouseLeave={(e) => {
          if (!isWishlisted) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
            e.currentTarget.style.color = '#9ca3af';
          }
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      </button>

      {/* Image */}
      <div className="relative overflow-hidden" style={{ background: 'var(--surface-2)', height: '220px' }}>
        <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--accent)' }}>
          {product.category.replace(/-/g, ' ')}
        </p>

        <h2 className="text-sm font-bold leading-snug line-clamp-2 mb-2" style={{ color: 'var(--text-primary)' }}>
          {product.title}
        </h2>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <Stars rating={product.rating ?? 4.5} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            ({product.reviews ?? 0})
          </span>
        </div>

        {/* Price & Action */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>
            {formatRupiah(product.price)}
          </span>
          <button id={`add-cart-btn-${product.id}`} type="button" onClick={handleAddToCart} className="btn-premium flex items-center gap-2 px-4 py-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6" />
            </svg>
            Beli
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
