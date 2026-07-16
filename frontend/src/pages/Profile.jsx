/**
 * ============================================
 * FILE: Profile.jsx
 * ASSIGNED TO: Muhammad Irfan Amelianso (24.11.5940)
 * JOBDESK: Halaman Profile
 * ============================================
 */

import { Navigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatRupiah } from "../data/muslimClothingProducts";

function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const { orders, cartItems } = useCart();
  const { wishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState("overview");

  if (!isAuthenticated) return <Navigate to="/login" />;

  const totalSpent = orders.reduce((sum, o) => sum + (o.grandTotal || o.total || 0), 0);

  const stats = [
    { label: "Total Pesanan", value: orders.length, icon: "📦", color: "#6366f1" },
    { label: "Total Belanja", value: formatRupiah(totalSpent), icon: "💰", color: "#10b981" },
    { label: "Item Favorit", value: wishlist.length, icon: "❤️", color: "#ef4444" },
    { label: "Keranjang", value: cartItems.length, icon: "🛒", color: "#f59e0b" },
  ];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "info", label: "Info Akun" },
    { id: "orders", label: "Pesanan Saya" },
  ];

  return (
    <main id="profile-page">
      {/* Header Banner */}
      <div
        className="relative rounded-2xl overflow-hidden mb-6 h-36"
        style={{ background: "linear-gradient(135deg, var(--primary) 0%, #2d2d6e 100%)" }}
      >
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, var(--accent) 0%, transparent 50%)" }} />
        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
          <div className="flex items-end gap-4">
            {/* Avatar */}
            <div className="relative">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-extrabold border-4 text-white"
                style={{
                  background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                  borderColor: "var(--primary)",
                  color: "#1a1a2e",
                }}
              >
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 bg-green-400"
                style={{ borderColor: "var(--primary)" }} />
            </div>
            <div className="pb-1">
              <h1 className="text-xl font-extrabold text-white">{user?.name}</h1>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{user?.email}</p>
            </div>
          </div>
          <button
            id="profile-logout-btn"
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 
              rounded-xl text-sm font-semibold 
              transition-all"
            style={{ background: "rgba(239,68,68,0.15)", 
              color: "#fca5a5", 
              border: "1px solid rgba(239,68,68,0.3)" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.3)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Keluar
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={s.label} 
          className="card p-5 text-center animate-fade-in-up"
            style={{ animationDelay: `${i * 0.08}s` }}>
            <span className="text-2xl block mb-1">{s.icon}</span>
            <p className="text-lg font-extrabold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b" style={{ borderColor: "var(--border)" }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            id={`profile-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className="px-5 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px"
            style={{
              color: activeTab === tab.id ? "var(--accent)" : "var(--text-secondary)",
              borderColor: activeTab === tab.id ? "var(--accent)" : "transparent",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {/* Quick Links */}
          <div className="card p-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              Menu Cepat
            </h2>
            <div className="space-y-2">
              {[
                { label: "Semua Produk", href: "/products", icon: "🛍️", desc: "Jelajahi koleksi lengkap" },
                { label: "Keranjang Belanja", href: "/cart", icon: "🛒", desc: `${cartItems.length} item di keranjang` },
                { label: "Produk Favorit", href: "/favorites", icon: "❤️", desc: `${wishlist.length} item disimpan` },
                { label: "Riwayat Pesanan", href: "/orders", icon: "📦", desc: `${orders.length} pesanan dibuat` },
              ].map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all"
                  style={{ color: "var(--text-primary)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span className="text-xl w-8 text-center">{link.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{link.label}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{link.desc}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9,18 15,12 9,6"/>
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Last Order */}
          <div className="card p-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              Pesanan Terakhir
            </h2>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl block mb-2">📭</span>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>Belum ada pesanan</p>
                <Link to="/products" className="inline-block mt-3 text-sm font-semibold" style={{ color: "var(--accent)" }}>
                  Mulai Belanja →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(-2).reverse().map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: "var(--surface-2)" }}>
                    <div>
                      <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                        Order #{String(order.id).slice(-6)}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {new Date(order.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-gradient">
                        {formatRupiah(order.grandTotal || order.total)}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
                <Link to="/orders" className="block text-center text-sm font-semibold py-2 transition-all"
                  style={{ color: "var(--accent)" }}>
                  Lihat Semua Pesanan →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Info Akun Tab ── */}
      {activeTab === "info" && (
        <div className="card p-8 max-w-lg animate-fade-in">
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
            Informasi Akun
          </h2>
          <div className="space-y-4">
            {[
              { label: "Nama Lengkap", value: user?.name, icon: "👤" },
              { label: "Email", value: user?.email, icon: "📧" },
              { label: "Status Akun", value: "Aktif ✓", icon: "✅" },
              { label: "Member Sejak", value: new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long" }), icon: "📅" },
            ].map(field => (
              <div key={field.label} className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: "var(--surface-2)" }}>
                <span className="text-xl">{field.icon}</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                    {field.label}
                  </p>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--text-primary)" }}>
                    {field.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-3 rounded-xl text-sm font-bold border transition-all"
            style={{ color: "var(--text-primary)", borderColor: "var(--border)", background: "var(--surface-2)" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
            ✏️ Edit Profil (Coming Soon)
          </button>
        </div>
      )}

      {/* ── Orders Tab ── */}
      {activeTab === "orders" && (
        <div className="animate-fade-in">
          {orders.length === 0 ? (
            <div className="card text-center py-20">
              <span className="text-6xl block mb-4">📭</span>
              <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                Belum Ada Pesanan
              </h2>
              <Link to="/products" className="inline-block mt-4 px-6 py-3 rounded-xl font-bold text-sm"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-dark))", color: "#1a1a2e" }}>
                Mulai Belanja →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice().reverse().map((order, i) => (
                <div key={order.id} className="card p-6 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-sm font-extrabold" style={{ color: "var(--text-primary)" }}>
                        Order #{String(order.id).slice(-8)}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        {new Date(order.createdAt).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full font-bold"
                      style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>
                      ✓ {order.status}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <div style={{ color: "var(--text-secondary)" }}>
                      <span className="font-medium">Items:</span> {order.items?.length ?? 0}
                    </div>
                    <div style={{ color: "var(--text-secondary)" }}>
                      <span className="font-medium">Pembayaran:</span> {order.paymentMethod || "Transfer Bank"}
                    </div>
                    <div>
                      <span className="font-medium text-gradient text-base font-extrabold">
                        {formatRupiah(order.grandTotal || order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default Profile;