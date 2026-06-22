/**
 * ============================================
 * FILE: Category.jsx
 * SHARED BY:
 * - Muhammad Irfan Amelianso (24.11.5940): Kategori Pakaian Muslim
 * - Andika Cavllo B (24.11.5950): Kategori Hoodie
 * - Ahmad nur malik (24.11.5926): Kategori Kaos
 * - Muhammad Farrukh al ghifari (24.11.5936): Kategori Celana & Topi
 * ============================================
 */

import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProducts } from '../services/product-service';
import ProductGrid from '../components/ProductGrid';

const CATEGORY_MAP = {
  // ═══════════════════════════════════════════════════════════
  // KATEGORI PAKAIAN MUSLIM
  // Assigned to: Muhammad Irfan Amelianso (24.11.5940)
  // ═══════════════════════════════════════════════════════════
  'pakaian-muslim': {
    label: 'Pakaian Muslim',
    desc: 'Gamis, Abaya, Hijab, Mukena, dan berbagai pakaian muslim berkualitas tinggi.',
    banner: 'https://images.unsplash.com/photo-1595610652061-ca3cea3d10e3?w=1200&h=300&fit=crop',
    color: '#c9a96e',
    emoji: '🕌',
  },

  // ═══════════════════════════════════════════════════════════
  // KATEGORI HOODIE
  // Assigned to: Andika Cavllo B (24.11.5950)
  // ═══════════════════════════════════════════════════════════
  hoodie: {
    label: 'Hoodie',
    desc: 'Hoodie oversize, zipper, crop, dan streetwear premium untuk tampilan kasual kekinian.',
    banner: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200&h=300&fit=crop',
    color: '#6366f1',
    emoji: '🧥',
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORI KAOS
  // Assigned to: Ahmad nur malik (24.11.5926)
  // ═══════════════════════════════════════════════════════════
  kaos: {
    label: 'Kaos',
    desc: 'Kaos polos, grafis, polo, couple, dan berbagai pilihan dengan bahan berkualitas.',
    banner: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=300&fit=crop',
    color: '#10b981',
    emoji: '👕',
  },
  // ═══════════════════════════════════════════════════════════
  // KATEGORI CELANA & TOPI
  // Assigned to: Muhammad Farrukh al ghifari (24.11.5936)
  // ═══════════════════════════════════════════════════════════
  celana: {
    label: 'Celana',
    desc: 'Celana chinos, jeans, cargo, kulot, dan berbagai model untuk berbagai kesempatan.',
    banner: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1200&h=300&fit=crop',
    color: '#f59e0b',
    emoji: '👖',
  },
};

// ═══════════════════════════════════════════════════════════
// DAFTAR SEMUA KATEGORI
// ═══════════════════════════════════════════════════════════
const ALL_CATEGORIES = [
  // Muhammad Irfan Amelianso (24.11.5940)
  { key: 'pakaian-muslim', label: 'Pakaian Muslim', emoji: '🕌' },
  // Andika Cavllo B (24.11.5950)
  { key: 'hoodie', label: 'Hoodie', emoji: '🧥' },
  // Ahmad nur malik (24.11.5926)
  { key: 'kaos', label: 'Kaos', emoji: '👕' },
  // Muhammad Farrukh al ghifari (24.11.5936)
  { key: 'celana', label: 'Celana', emoji: '👖' },
];

function Category() {
  const { categoryName } = useParams();
  const cat = CATEGORY_MAP[categoryName];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryName) {
      let isMounted = true;
      setLoading(true);
      getProducts().then(allProducts => {
        if (!isMounted) return;
        setProducts(allProducts.filter(p => p.category === categoryName));
        setLoading(false);
      });
      return () => { isMounted = false; };
    }
  }, [categoryName]);

  // ════════════════════════════════════════════════════════════════
  // VIEW: TAMPILAN SEMUA KATEGORI
  // ════════════════════════════════════════════════════════════════
  if (!categoryName) {
    return (
      <main id="category-list-page">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>
            Browse
          </p>
          <h1 className="section-title">Semua Kategori</h1>
          <p className="section-subtitle">Pilih kategori produk yang kamu inginkan.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {ALL_CATEGORIES.map((c, i) => {
            const info = CATEGORY_MAP[c.key];
            return (
              <Link key={c.key} to={`/category/${c.key}`} id={`cat-card-${c.key}`} 
              className="group relative rounded-2xl 
              overflow-hidden h-52 animate-fade-in-up" 
              style={{ animationDelay: `${i * 0.1}s` }}>
                <img src={info.banner} alt={c.label} 
                className="absolute inset-0 w-full h-full object-cover 
                transition-transform 
                duration-500 group-hover:scale-110" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%)' }} />
                <div className="absolute inset-0 flex items-center p-8">
                  <div>
                    <span className="text-4xl mb-3 block">{c.emoji}</span>
                    <h2 className="text-2xl font-extrabold text-white mb-1">{c.label}</h2>
                    <p className="text-white/60 text-sm">{info.desc.slice(0, 60)}...</p>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full transition-all" style={{ background: info.color, color: '#1a1a2e' }}>
                      Lihat Produk →
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // VIEW: ERROR - KATEGORI TIDAK DITEMUKAN
  // ════════════════════════════════════════════════════════════════
  if (!cat) {
    return (
      <main className="text-center py-32">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="section-title mb-2">Kategori Tidak Ditemukan</h1>
        <Link to="/category" className="mt-5 
            inline-block px-6 py-3 
            rounded-xl font-bold text-sm 
            text-white" style={{ background: 'var(--accent)', color: '#1a1a2e' }}>
          Kembali ke Kategori
        </Link>
      </main>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // VIEW: TAMPILAN PRODUK KATEGORI TERPILIH
  // (Dikerjakan oleh owner kategori masing-masing)
  // ════════════════════════════════════════════════════════════════
  return (
    <main id={`category-${categoryName}-page`}>
      {/* Banner */}
      <div className="relative h-52 rounded-2xl overflow-hidden mb-8">
        <img src={cat.banner} alt={cat.label} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 100%)' }} />
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <span className="text-4xl mb-2 block">{cat.emoji}</span>
            <h1 className="text-3xl font-extrabold text-white">{cat.label}</h1>
            <p className="text-white/65 text-sm mt-1 max-w-md">{cat.desc}</p>
          </div>
        </div>
        <Link to="/category" className="absolute top-4 right-4 flex items-center gap-1.5 text-white text-sm font-medium px-4 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
          ← Semua Kategori
        </Link>
      </div>

      {/* Sub-nav categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {ALL_CATEGORIES.map((c) => (
          <Link
            key={c.key}
            to={`/category/${c.key}`}
            id={`sub-cat-${c.key}`}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: c.key === categoryName ? 'linear-gradient(135deg, var(--accent), var(--accent-dark))' : 'var(--surface)',
              color: c.key === categoryName ? '#1a1a2e' : 'var(--text-secondary)',
              border: `1px solid ${c.key === categoryName ? 'transparent' : 'var(--border)'}`,
            }}
          >
            {c.emoji} {c.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {products.length} produk tersedia
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Loading products...</div>
      ) : (
        <ProductGrid products={products} />
      )}
    </main>
  );
}

export default Category;
