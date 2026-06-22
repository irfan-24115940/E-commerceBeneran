/**
 * ============================================
 * FILE: Favorites.jsx
 * ASSIGNED TO: Andika Cavllo B (24.11.5950)
 * JOBDESK: Halaman Favorit (Wishlist)
 * ============================================
 */

import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatRupiah } from "../data/muslimClothingProducts";
import { useToast } from "../context/ToastContext";

function Favorites() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleMoveToCart = (item) => {
    addToCart(item);
    addToast(`${item.title} masuk keranjang!`, "success");
  };

  const handleRemove = (id) => {
    removeFromWishlist(id);
    addToast("Produk dihapus dari favorit", "info");
  };

  return (
    <main id="favorites-page" className="pb-20">
      {/* ── HEADER ── */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="animate-fade-in-up">
          <span className="section-tag">Wishlist Eksklusif</span>
          <h1 className="section-title-premium">Produk Favorit</h1>
          <p className="section-subtitle">
            {wishlist.length > 0
              ? `Ada ${wishlist.length} koleksi yang sedang Anda incar. Segera dapatkan sebelum kehabisan!`
              : "Daftar produk yang paling Anda inginkan akan muncul di sini."}
          </p>
        </div>
        
        {wishlist.length > 0 && (
          <div className="flex gap-3 animate-fade-in delay-200">
             <button 
               onClick={() => {
                 wishlist.forEach(item => addToCart(item));
                 addToast("Semua produk masuk keranjang!", "success");
               }}
               className="btn-premium flex items-center gap-2"
             >
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
               </svg>
               Beli Semua
             </button>
          </div>
        )}
      </header>

      {wishlist.length === 0 ? (
        /* ── EMPTY STATE (PROFESSIONAL) ── */
        <div className="card-modern flex flex-col items-center justify-center py-24 text-center animate-scale-up">
          <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mb-8 animate-float">
             <span className="text-5xl">❤️</span>
          </div>
          <h2 className="text-2xl font-extrabold mb-4">Daftar Favorit Masih Kosong</h2>
          <p className="text-gray-500 max-w-sm mb-10">
            Simpan produk yang Anda sukai agar tidak hilang. Mulai eksplorasi koleksi terbaru kami sekarang.
          </p>
          <Link to="/products" className="btn-premium px-10">
            Mulai Belanja →
          </Link>
        </div>
      ) : (
        /* ── FAVORITES LIST (EDITORIAL STYLE) ── */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {wishlist.map((item, i) => (
            <div
              key={item.id}
              className="card-modern group flex flex-col sm:flex-row items-center gap-6 p-6 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Image with Hover Effect */}
              <div className="w-full sm:w-44 h-56 sm:h-44 rounded-3xl overflow-hidden relative shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <button
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full glass flex items-center justify-center text-red-500 shadow-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                  title="Hapus"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"/>
                  </svg>
                </button>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <span className="section-tag mb-2">Member Favorite</span>
                <h2 className="text-xl font-extrabold text-gradient mb-1 truncate">{item.title}</h2>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                  {item.description || "Koleksi pilihan dengan material premium terbaik untuk kenyamanan Anda."}
                </p>
                
                <div className="flex items-center justify-between gap-4 mt-auto">
                   <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Harga</span>
                      <span className="text-xl font-black">{formatRupiah(item.price)}</span>
                   </div>
                   <button
                     onClick={() => handleMoveToCart(item)}
                     className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl hover:-translate-y-1 active:scale-95"
                     style={{ background: "var(--accent)", color: "#10101a" }}
                     title="Tambah ke Keranjang"
                   >
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6" />
                     </svg>
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── FOOTER CTA ── */}
      {wishlist.length > 0 && (
        <div className="mt-16 text-center animate-fade-in">
           <div className="p-12 rounded-[48px] overflow-hidden relative border border-white/5"
             style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)", color: "#ffffff" }}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px]" />
              <h2 className="text-3xl font-black mb-4 relative z-10">Lengkapi Koleksi Anda</h2>
              <p className="text-white/60 mb-8 relative z-10 max-w-lg mx-auto">Dapatkan diskon tambahan 5% untuk pembelian koleksi favorit hari ini. Penawaran terbatas!</p>
              <Link to="/products" className="btn-premium relative z-10">Lanjut Belanja →</Link>
           </div>
        </div>
      )}
    </main>
  );
}

export default Favorites;