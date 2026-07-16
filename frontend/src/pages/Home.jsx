/**
 * ============================================
 * FILE: Home.jsx
 * SHARED BY: Seluruh Tim (HALAMAN UTAMA)
 * ============================================
 */

import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProducts } from "../services/product-service";
import ProductCard from "../components/ProductCard";

function Home() {
  const navigate = useNavigate();
  const [heroIdx, setHeroIdx] = useState(0);
  const [trendingProducts, setTrendingProducts] = useState([]);

  const heroSlides = [
    {
      image: "https://loremflickr.com/1400/700/muslim,fashion,premium?lock=100",
      badge: "Koleksi Terbaru 2026",
      title: "Tampil Elegan\nBersama MistCo",
      sub: "Eksplorasi gaya modest modern yang dirancang khusus untuk kenyamanan dan kepercayaan diri Anda.",
      cta: "Belanja Sekarang",
      ctaHref: "/products",
    },
    {
      image: "https://loremflickr.com/1400/700/hoodie,streetwear,style?lock=101",
      badge: "Streetwear Edition",
      title: "Street Style\nModern Muslim",
      sub: "Padukan nilai tradisi dengan estetika urban yang stylish. Tersedia koleksi hoodie premium terbatas.",
      cta: "Lihat Koleksi",
      ctaHref: "/category/hoodie",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => setHeroIdx(i => (i + 1) % heroSlides.length), 6000);
    
    let isMounted = true;
    getProducts().then(products => {
      if (!isMounted) return;
      // Get 4 products for trending
      setTrendingProducts(products.slice(0, 4));
    });

    return () => {
      clearInterval(timer);
      isMounted = false;
    };
  }, []);

  const slide = heroSlides[heroIdx];

  const stats = [
    { label: "Produk Pilihan", val: "500+" },
    { label: "Pelanggan Puas", val: "10k+" },
    { label: "Rating Toko", val: "4.9" },
    { label: "Tahun Berdiri", val: "2024" },
  ];

  return (
    <main id="home-page" className="min-h-screen">

      {/* ═══ 1. HERO SECTION (ULTRA PREMIUM) ═══ */}
      <section id="hero-section" className="relative h-[650px] md:h-[750px] overflow-hidden rounded-[40px] mb-20 shadow-2xl group">
        <img
          key={heroIdx}
          src={slide.image}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] group-hover:scale-105"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to right, rgba(16,16,26,0.95) 0%, rgba(16,16,26,0.5) 50%, transparent 100%)"
        }} />

        {/* Content */}
        <div className="absolute inset-0 flex items-center px-8 md:px-24">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="section-tag !bg-white/20 !text-white !border-white/20">
              {slide.badge}
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6">
              {slide.title.split("\n").map((line, i) => (
                <span key={i} className={i === 1 ? "text-gradient block" : "block"}>{line}</span>
              ))}
            </h1>
            <p className="text-white/70 text-lg md:text-xl mb-10 max-w-lg leading-relaxed">
              {slide.sub}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={slide.ctaHref} className="btn-premium py-4 px-10 text-base shadow-[0_0_40px_rgba(201,169,110,0.3)]">
                {slide.cta} →
              </Link>
              <Link to="/about" className="btn-secondary !bg-white/10 !text-white !border-white/20 backdrop-blur-md hover:!bg-white/20">
                Tentang Kami
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === heroIdx ? "48px" : "12px",
                background: i === heroIdx ? "var(--accent)" : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>
      </section>

      {/* ═══ 2. TRENDING NOW (BIG PROJECT FEATURE) ═══ */}
      <section className="mb-24">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <span className="section-tag">Hot Deals</span>
            <h2 className="section-title-premium">Sedang Tren Sekarang</h2>
            <p className="section-subtitle">Koleksi yang paling banyak dicari minggu ini oleh para fashion enthusiast.</p>
          </div>
          <Link to="/products" className="text-sm font-bold uppercase tracking-widest text-gradient flex items-center gap-2 hover:gap-4 transition-all">
            Lihat Semua Produk <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingProducts.map((p, i) => (
            <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 3. BRAND VALUES (DYNAMIC) ═══ */}
      <section className="relative py-24 px-10 rounded-[48px] overflow-hidden mb-24 text-center"
        style={{ background: "var(--primary)" }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, var(--accent) 0%, transparent 50%)"
        }} />

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
          {stats.map((s, i) => (
            <div key={s.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <h3 className="text-4xl md:text-6xl font-extrabold text-white mb-2">{s.val}</h3>
              <p className="text-sm font-bold uppercase tracking-widest text-white/40">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 4. BANNER PROMO (LARGE SCALE) ═══ */}
      <section className="mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Large */}
          <div className="relative h-[450px] rounded-[40px] overflow-hidden group shadow-xl">
            <img src="https://loremflickr.com/800/600/hijab,modern?lock=301" alt="Promo" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-10 left-10 right-10">
              <span className="badge !bg-red-500 !text-white mb-3">Limited Edition</span>
              <h3 className="text-3xl font-extrabold text-white mb-4">Gamis Premium Series</h3>
              <p className="text-white/70 mb-6 max-w-sm">Dapatkan diskon eksklusif 30% hanya untuk koleksi Gamis Premium terbaru.</p>
              <Link to="/category/pakaian-muslim" className="btn-premium">Belanja Gamis</Link>
            </div>
          </div>
          {/* Right Two */}
          <div className="grid grid-rows-2 gap-8">
            <div className="relative rounded-[40px] overflow-hidden group shadow-lg">
              <img src="https://loremflickr.com/800/400/hoodie,black?lock=302" alt="Promo" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex flex-col justify-center px-10">
                <h3 className="text-2xl font-extrabold text-white mb-2">Hoodie Streetwear</h3>
                <p className="text-white/70 text-sm mb-4">Casual look untuk daily activity kamu.</p>
                <Link to="/category/hoodie" className="text-accent font-bold text-sm">Lihat Koleksi →</Link>
              </div>
            </div>
            <div className="relative rounded-[40px] overflow-hidden group shadow-lg">
              <img src="https://loremflickr.com/800/400/tshirt,white?lock=303" alt="Promo" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex flex-col justify-center px-10">
                <h3 className="text-2xl font-extrabold text-white mb-2">Essential T-Shirt</h3>
                <p className="text-white/70 text-sm mb-4">Kaos polos berkualitas dari cotton combed 30s.</p>
                <Link to="/category/kaos" className="text-accent font-bold text-sm">Cek Sekarang →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 5. TESTIMONIALS (PROFESSIONAL TOUCH) ═══ */}
      <section className="mb-24 text-center px-6">
        <span className="section-tag">Testimonials</span>
        <h2 className="section-title-premium mb-12">Apa Kata Mereka?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { name: "Sarah J.", text: "Kualitas bahannya luar biasa, adem banget dipakai seharian. MistCo emang terbaik!", role: "Loyal Customer" },
            { name: "Rizky A.", text: "Desainnya modern tapi tetep sopan. Pengirimannya juga cepet banget ke Jakarta.", role: "Influencer" },
            { name: "Linda W.", text: "Harganya sangat worth it dengan kualitas premium yang didapat. Bakal langganan!", role: "Fashion Blogger" },
          ].map((t, i) => (
            <div key={i} className="card-modern p-10 flex flex-col items-center animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => <span key={i} className="text-accent text-lg">★</span>)}
              </div>
              <p className="text-base italic mb-8" style={{ color: "var(--text-secondary)" }}>"{t.text}"</p>
              <h4 className="font-bold text-lg">{t.name}</h4>
              <p className="text-xs uppercase tracking-widest opacity-50">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}

export default Home;