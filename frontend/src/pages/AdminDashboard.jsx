/**
 * ============================================
 * FILE: AdminDashboard.jsx
 * JOBDESK: Halaman Admin Dashboard
 * ============================================
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../services/admin-service';
import { getTransactions } from '../services/transaction-service';
import { formatRupiah } from '../data/muslimClothingProducts';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      getDashboardStats(),
      getTransactions()
    ]).then(([statsData, ordersData]) => {
      if (!isMounted) return;
      if (statsData) {
        setStats(statsData);
      } else {
        setError('Gagal mengambil data dashboard. Pastikan Anda login sebagai admin.');
      }
      setRecentOrders((ordersData || []).slice(0, 5));
      setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  const statCards = stats ? [
    {
      label: 'Total Pengguna',
      value: stats.totalUsers.toLocaleString(),
      icon: '👥',
      color: '#6366f1',
      bg: 'rgba(99,102,241,0.1)',
      sub: 'Pengguna terdaftar'
    },
    {
      label: 'Total Produk',
      value: stats.totalProducts.toLocaleString(),
      icon: '📦',
      color: '#10b981',
      bg: 'rgba(16,185,129,0.1)',
      sub: 'Produk aktif di toko'
    },
    {
      label: 'Total Pesanan',
      value: stats.totalOrders.toLocaleString(),
      icon: '🛒',
      color: '#c9a96e',
      bg: 'rgba(201,169,110,0.1)',
      sub: 'Semua transaksi'
    },
    {
      label: 'Total Revenue',
      value: formatRupiah(stats.revenue),
      icon: '💰',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.1)',
      sub: 'Dari pesanan selesai'
    },
  ] : [];

  const STATUS_COLORS = {
    Processing: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', label: 'Proses' },
    Shipped:    { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1', label: 'Dikirim' },
    Delivered:  { bg: 'rgba(16,185,129,0.1)',  color: '#10b981', label: 'Selesai' },
    paid:       { bg: 'rgba(16,185,129,0.1)',  color: '#10b981', label: 'Lunas' },
    Cancelled:  { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444', label: 'Batal' },
  };

  if (loading) {
    return (
      <main id="admin-dashboard-page" className="pb-32">
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="w-16 h-16 rounded-full border-4 border-accent border-t-transparent animate-spin" />
          <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Memuat dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main id="admin-dashboard-page" className="pb-32">
        <div className="card-modern text-center py-24 px-8 max-w-lg mx-auto">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="section-title-premium mb-4">Akses Dibatasi</h1>
          <p className="text-gray-400 mb-8">{error}</p>
          <Link to="/" className="btn-premium px-8 py-3">Kembali ke Beranda</Link>
        </div>
      </main>
    );
  }

  return (
    <main id="admin-dashboard-page" className="pb-32">

      {/* ── HEADER ── */}
      <div className="mb-12 animate-fade-in-up">
        <span className="section-tag">Admin Panel</span>
        <h1 className="section-title-premium !mb-2">Dashboard</h1>
        <p className="section-subtitle">Ringkasan data real-time dari database PostgreSQL.</p>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((card, i) => (
          <div
            key={card.label}
            className="card-modern p-8 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.08}s`, borderTop: `3px solid ${card.color}` }}
          >
            <div className="flex items-center justify-between mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: card.bg }}
              >
                {card.icon}
              </div>
              <div
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ background: card.color }}
              />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">{card.label}</p>
            <p className="text-3xl font-black mb-1" style={{ color: card.color }}>{card.value}</p>
            <p className="text-[10px] text-gray-500 font-bold">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* ── RECENT ORDERS ── */}
      <div className="card-modern !p-0 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
        <div className="px-8 py-6 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
          <div>
            <h2 className="text-xl font-black">Pesanan Terbaru</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Data langsung dari PostgreSQL</p>
          </div>
          <Link
            to="/orders"
            className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
          >
            Lihat Semua →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <div className="text-4xl mb-4">📭</div>
            <p className="font-bold text-sm">Belum ada pesanan</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {recentOrders.map((order) => {
              const st = STATUS_COLORS[order.status] || STATUS_COLORS.Processing;
              const date = new Date(order.createdAt);
              return (
                <div key={order.id} className="px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-accent/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-black" style={{ background: st.bg, color: st.color }}>
                      #{String(order.id).slice(-2)}
                    </div>
                    <div>
                      <p className="text-sm font-black">Order #MST-{String(order.id).slice(-6).toUpperCase()}</p>
                      <p className="text-[10px] font-bold text-gray-400">
                        {order.customer?.fullName || 'N/A'} · {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 sm:justify-end">
                    <span
                      className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest"
                      style={{ background: st.bg, color: st.color }}
                    >
                      {st.label}
                    </span>
                    <span className="text-sm font-black">{formatRupiah(order.grandTotal)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── INFO FOOTER ── */}
      <div className="mt-10 p-6 rounded-3xl border border-accent/20 bg-accent/5 flex flex-wrap items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
        <div className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center text-xl">🗄️</div>
        <div className="flex-1">
          <p className="text-xs font-black uppercase tracking-widest text-accent">PostgreSQL Connected</p>
          <p className="text-[10px] text-gray-400 font-bold">Data diambil langsung dari database via <code className="text-accent">GET /admin/dashboard</code></p>
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
      </div>

    </main>
  );
}

export default AdminDashboard;
