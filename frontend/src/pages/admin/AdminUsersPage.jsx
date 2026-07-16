/**
 * AdminUsersPage.jsx – Daftar users + edit role
 */
import { useState, useEffect } from 'react';
import { fetchAdminUsers, updateUserRole } from '../../services/admin-api';
import { useAuth } from '../../context/AuthContext';

const ROLE_STYLE = {
  admin:    { bg: 'rgba(99,102,241,0.12)', color: '#818cf8' },
  customer: { bg: 'rgba(156,163,175,0.08)', color: '#9ca3af' },
};

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch]       = useState('');

  const load = () => {
    setLoading(true);
    fetchAdminUsers()
      .then(d => setUsers(d?.users || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleRoleChange = async (id, role) => {
    if (id === currentUser?.id) {
      alert('Anda tidak dapat mengubah role diri sendiri.');
      return;
    }
    setUpdatingId(id);
    try {
      await updateUserRole(id, role);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    } catch (e) {
      alert('Error: ' + e.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Manajemen</p>
        <h1 className="text-2xl font-black text-white">Users</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} pengguna terdaftar</p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Cari nama atau email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full sm:w-72 px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-indigo-500"
        style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.08)' }}
      />

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
                  {['Name','Email','Role','Phone','Action'].map(h => (
                    <th key={h} className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const rs = ROLE_STYLE[u.role] || ROLE_STYLE.customer;
                  const isMe = u.id === currentUser?.id;
                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-white/[0.02] transition-colors"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                            style={{ background: 'rgba(99,102,241,0.3)' }}
                          >
                            {u.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="text-white font-semibold text-xs">{u.name}</p>
                            {isMe && (
                              <span className="text-[9px] text-indigo-400 font-black">YOU</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{u.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full"
                          style={{ background: rs.bg, color: rs.color }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{u.phone || '-'}</td>
                      <td className="px-4 py-3">
                        {isMe ? (
                          <span className="text-[10px] text-gray-600 font-bold">—</span>
                        ) : (
                          <select
                            value={u.role}
                            onChange={e => handleRoleChange(u.id, e.target.value)}
                            disabled={updatingId === u.id}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold outline-none cursor-pointer disabled:opacity-50"
                            style={{
                              background: rs.bg,
                              color: rs.color,
                              border: `1px solid ${rs.color}40`,
                            }}
                          >
                            <option value="customer" style={{ background: '#131720', color: '#fff' }}>customer</option>
                            <option value="admin" style={{ background: '#131720', color: '#fff' }}>admin</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center text-gray-600 text-sm">
                      Tidak ada pengguna ditemukan.
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
