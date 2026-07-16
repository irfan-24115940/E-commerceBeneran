/**
 * ============================================
 * FILE: Products.jsx
 * SHARED BY: Seluruh Tim (HALAMAN PRODUK)
 * ============================================
 */

import { useState, useEffect } from "react";
import { formatRupiah } from "../data/muslimClothingProducts"; // keep for formatting
import { getProducts } from "../services/product-service";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState(500000);
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: "all", label: "Semua Koleksi" },
    { id: "pakaian-muslim", label: "Muslim Wear" },
    { id: "hoodie", label: "Modern Hoodie" },
    { id: "kaos", label: "Essential T-Shirt" },
    { id: "celana", label: "Premium Pants" },
  ];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchFilteredProducts = async () => {
      try {
        const allProducts = await getProducts();
        if (!isMounted) return;

        let filtered = [...allProducts];
        if (category !== "all") filtered = filtered.filter(p => p.category === category);
        if (search) filtered = filtered.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
        filtered = filtered.filter(p => p.price <= priceRange);

        if (sortBy === "price-low") filtered.sort((a, b) => a.price - b.price);
        else if (sortBy === "price-high") filtered.sort((a, b) => b.price - a.price);
        else if (sortBy === "rating") filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

        setProducts(filtered);
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchFilteredProducts();
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [category, search, priceRange, sortBy]);

  return (
    <main className="min-h-screen bg-app transition-colors duration-500">

      {/* ── CINEMATIC HERO ── */}
      <section className="relative h-[450px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Collection Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-app" />
        <div className="relative z-10 text-center px-6 animate-scale-up">
          <span className="section-tag !bg-accent !text-primary !mb-6">Exclusive Collections</span>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 drop-shadow-2xl">MISTCO</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto font-medium">Elevating modesty through premium craftsmanship and modern silhouettes.</p>
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 pb-32">

        {/* ── THEME-AWARE FLOATING BAR ── */}
        <div className="sticky top-20 z-40 py-6 mb-12 -mx-6 lg:-mx-12 px-6 lg:px-12">
          <div className="glass-premium rounded-[32px] p-2.5 flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10 dark:border-white/5 shadow-2xl">

            {/* Category Chips */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full md:w-auto px-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 shrink-0 ${category === cat.id
                      ? "bg-accent text-primary shadow-lg shadow-accent/20"
                      : "text-gray-500 dark:text-white/40 hover:text-accent"
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Theme-Aware Search & Filter */}
            <div className="flex items-center gap-3 w-full md:w-auto px-2">
              <div className="relative flex-1 md:w-64 group">
                <input
                  type="text"
                  placeholder="Search collections..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full rounded-2xl px-6 py-3 text-[11px] font-bold outline-none transition-all duration-500"
                  style={{
                    background: 'var(--surface-2)',
                    border: '2px solid var(--border)',
                    color: 'var(--text-primary)'
                  }}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 opacity-50 group-focus-within:text-accent group-focus-within:opacity-100 transition-all">
                  🔍
                </div>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${showFilters
                    ? "bg-primary text-white scale-110"
                    : "bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-400 hover:text-accent"
                  }`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── ADVANCED FILTERS (THEME FIXED) ── */}
        {showFilters && (
          <div className="animate-scale-up mb-16 p-12 rounded-[48px] bg-white dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 grid grid-cols-1 md:grid-cols-3 gap-16 shadow-2xl">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-8">Price Threshold</h4>
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Max Budget</span>
                  <span className="text-xl font-black text-gradient">{formatRupiah(priceRange)}</span>
                </div>
                <input
                  type="range" min="50000" max="500000" step="10000"
                  value={priceRange} onChange={e => setPriceRange(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-8">Sort Selection</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "default", l: "Newest" },
                  { id: "price-low", l: "Price: Low" },
                  { id: "price-high", l: "Price: High" },
                  { id: "rating", l: "Top Rated" }
                ].map(s => (
                  <button
                    key={s.id} onClick={() => setSortBy(s.id)}
                    className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all duration-500 ${sortBy === s.id
                        ? "bg-primary text-white border-primary shadow-xl"
                        : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:border-accent hover:text-accent"
                      }`}
                  >
                    {s.l}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-end">
              <button
                onClick={() => { setCategory("all"); setSearch(""); setPriceRange(500000); setSortBy("default"); }}
                className="w-full py-5 rounded-2xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all duration-500"
              >
                Reset Experience
              </button>
            </div>
          </div>
        )}

        {/* ── PRODUCT GRID ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {products.map((p, i) => (
              <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center animate-scale-up">
            <div className="text-8xl mb-8 opacity-20">🔎</div>
            <h2 className="text-4xl font-black mb-4 tracking-tighter">No Matches Found</h2>
            <p className="text-gray-400 mb-12 max-w-sm mx-auto font-medium">We couldn't find any products matching your specific selection. Try adjusting the filters.</p>
            <button onClick={() => { setCategory("all"); setSearch(""); setPriceRange(500000); }} className="btn-premium px-12">Clear Search</button>
          </div>
        )}

      </div>
    </main>
  );
}

export default Products;