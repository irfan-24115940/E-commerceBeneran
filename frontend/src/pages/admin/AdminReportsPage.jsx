/**
 * AdminReportsPage.jsx – Laporan analytics admin
 */
import { useState, useEffect } from 'react';
import { fetchReports } from '../../services/admin-api';

const formatRp = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n || 0);

const STATUS_STYLE = {
  Pending:    { bg: 'rgba(156,163,175,0.12)', color: '#9ca3af' },
  Processing: { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b' },
  Shipped:    { bg: 'rgba(99,102,241,0.12)',  color: '#818cf8' },
  Completed:  { bg: 'rgba(16,185,129,0.12)',  color: '#10b981' },
  Cancelled:  { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444' },
  paid:       { bg: 'rgba(16,185,129,0.12)',  color: '#10b981' },
};

export default function AdminReportsPage() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    fetchReports()
      .then(d => setData(d))
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

  if (error || !data) {
    return (
      <div className="p-8 text-center text-red-400 text-sm">{error || 'Gagal memuat laporan'}</div>
    );
  }

  const summaryCards = [
    { label: 'Total Users',    value: (data.totalUsers || 0).toLocaleString('id-ID'),     icon: '👥', color: '#818cf8', bg: 'rgba(99,102,241,0.12)' },
    { label: 'Total Products', value: (data.totalProducts || 0).toLocaleString('id-ID'),  icon: '📦', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    { label: 'Total Orders',   value: (data.totalOrders || 0).toLocaleString('id-ID'),    icon: '🛒', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    { label: 'Total Sales',    value: formatRp(data.totalSales),                           icon: '💰', color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Analytics</p>
        <h1 className="text-2xl font-black text-white">Reports</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {summaryCards.map(c => (
          <div
            key={c.label}
            className="rounded-2xl p-6"
            style={{ background: '#0f1117', border: `1px solid ${c.color}22` }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{ background: c.bg }}>
              {c.icon}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{c.label}</p>
            <p className="text-2xl font-black" style={{ color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Recent Orders */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-6 py-5 border-b border-white/5">
            <h2 className="text-sm font-black text-white">Recent Orders</h2>
            <p className="text-[10px] text-gray-500 mt-0.5">10 pesanan terbaru</p>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {(data.recentOrders || []).map(o => {
              const st = STATUS_STYLE[o.status] || STATUS_STYLE.Pending;
              const date = o.createdAt ? new Date(o.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'short', year: 'numeric'
              }) : '-';
              return (
                <div key={o.id} className="px-6 py-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-white text-xs font-bold">#{String(o.id).padStart(6, '0')}</p>
                    <p className="text-gray-500 text-[10px] truncate">{o.customerName} · {date}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className="text-[9px] font-black uppercase px-2 py-1 rounded-full"
                      style={{ background: st.bg, color: st.color }}
                    >
                      {o.status}
                    </span>
                    <span className="text-white text-xs font-bold">{formatRp(o.grandTotal)}</span>
                  </div>
                </div>
              );
            })}
            {!data.recentOrders?.length && (
              <div className="px-6 py-12 text-center text-gray-600 text-xs">Belum ada pesanan</div>
            )}
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-6 py-5 border-b border-white/5">
            <h2 className="text-sm font-black text-white">Best Selling Products</h2>
            <p className="text-[10px] text-gray-500 mt-0.5">Berdasarkan jumlah terjual</p>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {(data.bestSellingProducts || []).map((p, idx) => (
              <div key={p.id} className="px-6 py-4 flex items-center gap-4">
                <span className="text-gray-600 text-xs font-black w-5 shrink-0">#{idx + 1}</span>
                <img
                  src={p.image || 'https://via.placeholder.com/32'}
                  alt={p.title}
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                  onError={e => { e.target.src = 'https://via.placeholder.com/32'; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{p.title}</p>
                  <p className="text-gray-500 text-[10px]">{formatRp(p.totalRevenue)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-indigo-400 text-xs font-black">{p.totalSold}</p>
                  <p className="text-gray-600 text-[10px]">terjual</p>
                </div>
              </div>
            ))}
            {!data.bestSellingProducts?.length && (
              <div className="px-6 py-12 text-center text-gray-600 text-xs">Belum ada data penjualan</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
