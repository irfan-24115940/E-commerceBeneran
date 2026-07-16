/**
 * AdminOrdersPage.jsx – Daftar semua orders + ubah status
 */
import { useState, useEffect } from 'react';
import { fetchAdminOrders, updateOrderStatus } from '../../services/admin-api';

const formatRp = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n || 0);

const STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_STYLE = {
  Processing: { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b' },
  Shipped:    { bg: 'rgba(99,102,241,0.12)',  color: '#818cf8' },
  Delivered:  { bg: 'rgba(16,185,129,0.12)',  color: '#10b981' },
  Cancelled:  { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444' },
  paid:       { bg: 'rgba(16,185,129,0.12)',  color: '#10b981' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [updatingId, setUpdatingId]   = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const load = () => {
    setLoading(true);
    fetchAdminOrders()
      .then(d => setOrders(d?.orders || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateOrderStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (e) {
      alert('Error: ' + e.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Manajemen</p>
        <h1 className="text-2xl font-black text-white">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">{orders.length} total pesanan</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', ...STATUSES].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
              filterStatus === s
                ? 'bg-indigo-600 text-white'
                : 'text-gray-500 hover:text-white'
            }`}
            style={filterStatus !== s ? { background: 'rgba(255,255,255,0.04)' } : {}}
          >
            {s === 'all' ? 'Semua' : s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.06)' }}>
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400 text-sm">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Order ID','Customer','Date','Total','Payment','Status'].map(h => (
                    <th key={h} className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  const st = STATUS_STYLE[o.status] || STATUS_STYLE.Processing;
                  const date = o.createdAt ? new Date(o.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  }) : '-';
                  return (
                    <tr
                      key={o.id}
                      className="hover:bg-white/[0.02] transition-colors"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    >
                      <td className="px-4 py-3">
                        <p className="text-white font-bold text-xs">#{String(o.id).padStart(6, '0')}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-white text-xs font-semibold">{o.customerName}</p>
                        <p className="text-gray-500 text-[10px]">{o.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{date}</td>
                      <td className="px-4 py-3 text-white font-semibold text-xs whitespace-nowrap">
                        {formatRp(o.grandTotal)}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{o.paymentMethod || '-'}</td>
                      <td className="px-4 py-3">
                        <select
                          value={o.status}
                          onChange={e => handleStatusChange(o.id, e.target.value)}
                          disabled={updatingId === o.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold outline-none cursor-pointer disabled:opacity-50"
                          style={{
                            background: st.bg,
                            color: st.color,
                            border: `1px solid ${st.color}40`,
                          }}
                        >
                          {STATUSES.map(s => (
                            <option key={s} value={s} style={{ background: '#131720', color: '#fff' }}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center text-gray-600 text-sm">
                      Tidak ada pesanan ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
