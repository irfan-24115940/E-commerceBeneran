/**
 * AdminDashboard.jsx – Halaman utama dashboard admin
 * Menampilkan stats cards + recent orders
 */
import { useState, useEffect } from 'react';
import { fetchDashboard } from '../services/admin-api';

const formatRp = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n || 0);

const STATUS_COLORS = {
  Processing: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', label: 'Proses' },
  Shipped:    { bg: 'rgba(99,102,241,0.12)',  color: '#818cf8', label: 'Dikirim' },
  Completed:  { bg: 'rgba(16,185,129,0.12)',  color: '#10b981', label: 'Selesai' },
  paid:       { bg: 'rgba(16,185,129,0.12)',  color: '#10b981', label: 'Lunas' },
  Cancelled:  { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444', label: 'Batal' },
  Pending:    { bg: 'rgba(156,163,175,0.12)', color: '#9ca3af', label: 'Menunggu' },
};

function StatCard({ icon, label, value, sub, color, bg, delay }) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4"
      style={{ background: '#0f1117', border: `1px solid ${color}22`, animationDelay: `${delay}s` }}
    >
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: bg }}>
          {icon}
        </div>
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{label}</p>
        <p className="text-3xl font-black" style={{ color }}>{value}</p>
        <p className="text-[10px] text-gray-600 font-bold mt-1">{sub}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard()
      .then(data => setStats(data?.stats || null))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-red-400 font-bold">{error || 'Gagal memuat data'}</p>
        </div>
      </div>
    );
  }

  const cards = [
    { icon: '👥', label: 'Total Pengguna',  value: stats.totalUsers.toLocaleString('id-ID'),    sub: 'User terdaftar',      color: '#818cf8', bg: 'rgba(99,102,241,0.12)',   delay: 0 },
    { icon: '📦', label: 'Total Produk',    value: stats.totalProducts.toLocaleString('id-ID'),  sub: 'Produk aktif',        color: '#10b981', bg: 'rgba(16,185,129,0.12)',   delay: 0.06 },
    { icon: '🛒', label: 'Total Pesanan',   value: stats.totalOrders.toLocaleString('id-ID'),    sub: 'Semua transaksi',     color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',   delay: 0.12 },
    { icon: '💰', label: 'Total Revenue',   value: formatRp(stats.revenue),                      sub: 'Dari pesanan selesai', color: '#34d399', bg: 'rgba(52,211,153,0.12)', delay: 0.18 },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1">Overview</p>
        <h1 className="text-2xl font-black text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Ringkasan data real-time dari PostgreSQL</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map(c => <StatCard key={c.label} {...c} />)}
      </div>

      {/* Info */}
      <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: '#0f1117', border: '1px solid rgba(99,102,241,0.2)' }}>
        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-xl shrink-0">🗄️</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black uppercase tracking-widest text-indigo-400">PostgreSQL Connected</p>
          <p className="text-[10px] text-gray-500 font-bold">
            Data diambil via <code className="text-indigo-400">GET /admin/dashboard</code>
          </p>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
      </div>
    </div>
  );
}
