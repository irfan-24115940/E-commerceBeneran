/**
 * ============================================
 * FILE: ProductDetail.jsx
 * Halaman Detail Produk
 * ============================================
 */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/product-service';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';
import { formatRupiah } from '../data/muslimClothingProducts';

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? 'var(--accent)' : 'none'}
          stroke={s <= Math.round(rating) ? 'var(--accent)' : 'var(--text-muted)'}
          strokeWidth="2">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isWishlisted = wishlist.some(i => i.id === product?.id);

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then(p => setProduct(p))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) addToCart(product);
    addToast(`${product.title} (x${qty}) masuk keranjang!`, 'success');
  };

  const toggleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      removeFromWishlist(product.id);
      addToast('Dihapus dari wishlist', 'info');
    } else {
      addToWishlist(product);
      addToast('Ditambahkan ke wishlist', 'success');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-20 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="rounded-3xl bg-gray-200 dark:bg-white/5 h-96" />
            <div className="space-y-4">
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-white/5" />
              <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-white/5" />
              <div className="h-6 w-1/3 rounded bg-gray-200 dark:bg-white/5" />
              <div className="h-24 rounded bg-gray-200 dark:bg-white/5" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-black mb-2">Produk tidak ditemukan</h1>
          <Link to="/products" className="btn-premium px-8 py-3 mt-4">
            Kembali ke Produk
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="product-detail-page" className="min-h-screen">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-xs font-bold text-gray-400">
        <Link to="/" className="hover:text-accent transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-accent transition-colors">Products</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)' }}>{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

        {/* ── IMAGE ── */}
        <div className="animate-fade-in-up">
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: 'var(--surface)', aspectRatio: '1 / 1' }}
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <div
                className="absolute top-5 left-5 badge text-xs"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', color: '#1a1a2e' }}
              >
                {product.badge}
              </div>
            )}
            {/* Wishlist */}
            <button
              id={`detail-wishlist-${product.id}`}
              onClick={toggleWishlist}
              className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
              style={{
                background: isWishlisted ? '#ef4444' : 'rgba(255,255,255,0.9)',
                color: isWishlisted ? '#fff' : '#9ca3af',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── PRODUCT INFO ── */}
        <div className="animate-fade-in-up flex flex-col gap-5" style={{ animationDelay: '0.1s' }}>

          {/* Category */}
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
            {product.category?.replace(/-/g, ' ')}
          </p>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-black leading-tight" style={{ color: 'var(--text-primary)' }}>
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <Stars rating={product.rating ?? 4.5} />
            <span className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
              {product.rating?.toFixed(1) ?? '4.5'} ({product.reviews ?? 0} ulasan)
            </span>
          </div>

          {/* Price */}
          <div className="py-4 px-5 rounded-2xl" style={{ background: 'var(--surface)' }}>
            <p className="text-4xl font-black" style={{ color: 'var(--text-primary)' }}>
              {formatRupiah(product.price)}
            </p>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                Deskripsi
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {product.description}
              </p>
            </div>
          )}

          {/* Stock */}
          <div className="flex items-center gap-3">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: product.stock > 0 ? '#10b981' : '#ef4444' }}
            />
            <span className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
              {product.stock > 0
                ? `Stok tersedia: ${product.stock} pcs`
                : 'Stok habis'}
            </span>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <p className="text-sm font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Qty</p>
            <div className="flex items-center rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-lg font-bold transition-colors hover:bg-accent/10"
                style={{ color: 'var(--text-primary)' }}
              >
                −
              </button>
              <span className="w-12 text-center text-sm font-black" style={{ color: 'var(--text-primary)' }}>
                {qty}
              </span>
              <button
                onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))}
                className="w-10 h-10 flex items-center justify-center text-lg font-bold transition-colors hover:bg-accent/10"
                style={{ color: 'var(--text-primary)' }}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            id={`detail-add-cart-${product.id}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-premium w-full py-4 text-base flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6" />
            </svg>
            {product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
          </button>

          {/* Back to Products */}
          <Link
            to="/products"
            className="text-center text-sm font-bold py-3 rounded-2xl transition-colors hover:bg-accent/10"
            style={{ color: 'var(--text-muted)' }}
          >
            ← Kembali ke Semua Produk
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ProductDetail;
