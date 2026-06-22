/**
 * ============================================
 * FILE: Footer.jsx
 * ASSIGNED TO: Muhammad Dhani Favian (24.11.5944)
 * JOBDESK: Header dan Footer
 * ============================================
 */

import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  const categories = [
    { label: "Pakaian Muslim", href: "/category/pakaian-muslim" },
    { label: "Hoodie", href: "/category/hoodie" },
    { label: "Kaos", href: "/category/kaos" },
    { label: "Celana", href: "/category/celana" },
  ];

  const links = [
    { label: "Beranda", href: "/" },
    { label: "Semua Produk", href: "/products" },
    { label: "Favorit", href: "/favorites" },
    { label: "Tentang Kami", href: "/about" },
  ];

  const account = [
    { label: "Login", href: "/login" },
    { label: "Daftar", href: "/register" },
    { label: "Profil Saya", href: "/profile" },
    { label: "Riwayat Pesanan", href: "/orders" },
  ];

  return (
    <footer className="mt-12" style={{ background: "#0a0a16", color: "#f8f7f4" }}>
      {/* ── TOP STRIP (Newsletter) ── */}
      <div className="border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gradient tracking-tight">
              Newsletter MistCo
            </h2>
            <p className="text-sm mt-1 text-white/60">
              Dapatkan info promo & koleksi terbaru langsung ke email kamu.
            </p>
          </div>
          <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              id="footer-newsletter-email"
              type="email"
              placeholder="Email kamu..."
              className="flex-1 md:w-64 px-4 py-3 rounded-xl text-sm outline-none border"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "#ffffff",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            />
            <button
              id="footer-newsletter-btn"
              type="submit"
              className="px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg"
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                color: "#1a1a2e",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* ── MAIN FOOTER ── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xl"
                style={{
                  background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                  color: "#1a1a2e",
                }}
              >
                M
              </div>
              <span className="text-2xl font-extrabold text-gradient tracking-tight">
                MistCo
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/50 max-w-xs">
              Membangun standar baru dalam modest fashion yang modern, elegan, dan berkualitas tinggi sejak tahun 2024.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {["Instagram", "TikTok", "WhatsApp"].map((s) => (
                <a
                  key={s}
                  href="#"
                  id={`footer-social-${s.toLowerCase()}`}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all border"
                  style={{ background: "rgba(255,255,255,0.03)", color: "white", borderColor: "rgba(255,255,255,0.1)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--accent)";
                    e.currentTarget.style.color = "#1a1a2e";
                    e.currentTarget.style.borderColor = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Kategori */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: "var(--accent)" }}>
              Kategori
            </h3>
            <ul className="space-y-4">
              {categories.map((c) => (
                <li key={c.href}>
                  <Link
                    to={c.href}
                    id={`footer-cat-${c.label.toLowerCase().replace(/\s/g, "-")}`}
                    className="text-sm font-medium transition-colors text-white/60 hover:text-white"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: "var(--accent)" }}>
              Navigasi
            </h3>
            <ul className="space-y-4">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    to={l.href}
                    id={`footer-nav-${l.label.toLowerCase().replace(/\s/g, "-")}`}
                    className="text-sm font-medium transition-colors text-white/60 hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Akun */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: "var(--accent)" }}>
              Akun Saya
            </h3>
            <ul className="space-y-4">
              {account.map((a) => (
                <li key={a.href}>
                  <Link
                    to={a.href}
                    id={`footer-acc-${a.label.toLowerCase().replace(/\s/g, "-")}`}
                    className="text-sm font-medium transition-colors text-white/60 hover:text-white"
                  >
                    {a.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div
          className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
        >
          <p className="text-xs text-white/30">
            © {year} MistCo Store. Dibuat dengan ❤️ untuk Fashion Muslim Indonesia.
          </p>
          <div className="flex items-center gap-6">
            {["Syarat & Ketentuan", "Kebijakan Privasi"].map((t) => (
              <a
                key={t}
                href="#"
                className="text-xs text-white/30 hover:text-white transition-colors"
              >
                {t}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {["VISA", "Mastercard", "GoPay", "OVO", "Dana"].map((p) => (
              <span
                key={p}
                className="text-[10px] px-2 py-1 rounded font-bold border"
                style={{ background: "rgba(255,255,255,0.03)", color: "white/40", borderColor: "rgba(255,255,255,0.05)" }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;