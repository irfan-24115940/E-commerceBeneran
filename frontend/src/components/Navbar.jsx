/**
 * ============================================
 * FILE: Navbar.jsx
 * ASSIGNED TO: Muhammad Dhani Favian (24.11.5944)
 * JOBDESK: Header dan Footer
 * ============================================
 */

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";
import { getProducts } from "../services/product-service";

// Icons (Same as before but cleaned up)
const IconHome = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);
const IconShop = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
  </svg>
);
const IconGrid = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);
const IconHeart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);
const IconCart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6" />
  </svg>
);
const IconInfo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const IconX = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconMoon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);
const IconSun = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const IconLogOut = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16,17 21,12 16,7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const IconChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6,9 12,15 18,9" /></svg>
);

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Live search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    let isMounted = true;
    const q = searchQuery.toLowerCase();
    getProducts().then(allProducts => {
      if (!isMounted) return;
      const results = allProducts
        .filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
        .slice(0, 5);
      setSearchResults(results);
    });
    return () => { isMounted = false; };
  }, [searchQuery]);

  // Close search on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const formatRp = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  const categories = [
    { label: "Pakaian Muslim", href: "/category/pakaian-muslim" },
    { label: "Hoodie", href: "/category/hoodie" },
    { label: "Kaos", href: "/category/kaos" },
    { label: "Celana", href: "/category/celana" },
  ];

  const navLinks = [
    { label: "Home", href: "/", icon: <IconHome /> },
    { label: "Products", href: "/products", icon: <IconShop /> },
    { label: "Favorit", href: "/favorites", icon: <IconHeart /> },
    { label: "About", href: "/about", icon: <IconInfo /> },
  ];

  return (
    <header
      id="main-navbar"
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-lg backdrop-blur-xl" : "shadow-sm"
        }`}
      style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" id="nav-logo" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))" }}>
              M
            </div>
            <span className="text-xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Mist<span className="text-gradient">Co</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "var(--surface-2)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
              >
                {link.icon} {link.label}
              </Link>
            ))}

            {/* Category Dropdown */}
            <div className="relative" onMouseLeave={() => setCategoryOpen(false)}>
              <button
                onMouseEnter={() => setCategoryOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{ color: "var(--text-secondary)" }}
              >
                <IconGrid /> Kategori <IconChevronDown />
              </button>
              {categoryOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 rounded-xl shadow-xl border py-2 animate-slide-down"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  {categories.map(cat => (
                    <Link
                      key={cat.href}
                      to={cat.href}
                      onClick={() => setCategoryOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "var(--surface-2)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div ref={searchRef} className="relative hidden sm:block">
              {searchOpen ? (
                <div className="animate-scale-in">
                  <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Cari produk..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-56 text-sm px-4 py-2 rounded-l-lg border outline-none"
                      style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                    />
                    <button type="submit" className="px-3 py-2 rounded-r-lg text-white" style={{ background: "var(--accent)" }}>
                      <IconSearch />
                    </button>
                  </form>
                  {searchResults.length > 0 && (
                    <div className="absolute top-full mt-1 left-0 right-0 rounded-xl shadow-xl border py-2 z-50"
                      style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                      {searchResults.map(p => (
                        <Link
                          key={p.id}
                          to={`/products?search=${encodeURIComponent(p.title)}`}
                          onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                          style={{ color: "var(--text-primary)" }}
                          onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <img src={p.image} alt={p.title} className="w-9 h-9 object-cover rounded-lg" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{p.title}</p>
                            <p className="text-xs" style={{ color: "var(--accent)" }}>{formatRp(p.price)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg transition-all"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "var(--surface-2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
                >
                  <IconSearch />
                </button>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-all"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "var(--surface-2)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
            >
              {darkMode ? <IconSun /> : <IconMoon />}
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-all"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "var(--surface-2)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
            >
              <IconCart />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center text-white"
                  style={{ background: "var(--accent)", color: "#1a1a2e" }}>
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link
              to="/favorites"
              className="relative w-9 h-9 hidden sm:flex items-center justify-center rounded-lg transition-all"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "var(--surface-2)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; }}
            >
              <IconHeart />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold rounded-full flex items-center justify-center bg-red-500 text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/admin"
                  className="text-sm font-semibold px-3 py-2 rounded-lg transition-all"
                  style={{ color: "var(--text-secondary)" }}
                  title="Admin Dashboard"
                  onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
                >
                  ⚙️
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{ background: "var(--surface-2)", color: "var(--text-primary)" }}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ background: "var(--accent)", color: "#1a1a2e" }}>
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  {user?.name?.split(" ")[0]}
                </Link>
                <button
                  onClick={logout}
                  className="w-9 h-9 flex items-center justify-center rounded-lg transition-all text-red-400"
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.color = "#ef4444"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#f87171"; }}
                >
                  <IconLogOut />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="text-sm font-semibold px-3 py-2 rounded-lg transition-all"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}>
                  Masuk
                </Link>
                <Link to="/register" className="text-sm font-bold px-4 py-2 rounded-lg transition-all"
                  style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", color: "#1a1a2e" }}>
                  Daftar
                </Link>
              </div>
            )}

            {/* Mobile Menu Btn */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg"
              style={{ color: "var(--text-primary)" }}
            >
              {mobileOpen ? <IconX /> : <IconMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t animate-slide-down" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <div className="px-4 py-6 space-y-4">
            {navLinks.map(link => (
              <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                {link.icon} {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t" style={{ borderColor: "var(--border)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Kategori</p>
              <div className="grid grid-cols-2 gap-3">
                {categories.map(cat => (
                  <Link key={cat.href} to={cat.href} onClick={() => setMobileOpen(false)}
                    className="text-xs font-medium px-3 py-2 rounded-lg" style={{ background: "var(--surface-2)", color: "var(--text-secondary)" }}>
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t flex flex-col gap-3" style={{ borderColor: "var(--border)" }}>
              {isAuthenticated ? (
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "var(--accent)", color: "#1a1a2e" }}>
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  {user?.name}
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-center py-2.5 rounded-xl text-sm font-bold border" style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}>Masuk</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="text-center py-2.5 rounded-xl text-sm font-bold" style={{ background: "var(--accent)", color: "#1a1a2e" }}>Daftar</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;