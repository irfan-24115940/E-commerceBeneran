/**
 * AdminCategoriesPage.jsx – CRUD Categories untuk Admin
 */
import { useState, useEffect } from 'react';
import {
  fetchAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../services/admin-api';

const EMPTY_FORM = { name: '', key: '', description: '' };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);

  const load = () => {
    setLoading(true);
    fetchAdminCategories()
      .then(d => setCategories(d?.categories || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditItem(c);
    setForm({ name: c.name || '', key: c.key || '', description: c.description || '' });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await updateCategory(editItem.id, form);
      } else {
        await createCategory(form);
      }
      setShowModal(false);
      load();
    } catch (e) {
      alert('Error: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus kategori ini?')) return;
    try {
      await deleteCategory(id);
      load();
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Manajemen</p>
          <h1 className="text-2xl font-black text-white">Categories</h1>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-colors"
        >
          <span>+</span> Add Category
        </button>
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
                  {['Key','Name','Description','Action'].map(h => (
                    <th key={h} className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-white/[0.02] transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <td className="px-4 py-3">
                      <code className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">{c.key}</code>
                    </td>
                    <td className="px-4 py-3 text-white font-semibold">{c.name}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs max-w-[300px]">
                      <p className="line-clamp-2">{c.description || '-'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-16 text-center text-gray-600 text-sm">
                      Belum ada kategori.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div
            className="relative w-full max-w-md rounded-2xl p-7"
            style={{ background: '#131720', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <h2 className="text-lg font-black text-white mb-6">
              {editItem ? 'Edit Category' : 'Add Category'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Name *</label>
                <input
                  type="text" required value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Nama kategori"
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ background: '#0a0d14', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Key *</label>
                <input
                  type="text" required value={form.key}
                  onChange={e => setForm(f => ({ ...f, key: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  placeholder="pakaian-muslim"
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ background: '#0a0d14', border: '1px solid rgba(255,255,255,0.08)' }}
                />
                <p className="text-[10px] text-gray-600 mt-1">Lowercase, gunakan tanda (-) sebagai spasi</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Deskripsi kategori"
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  style={{ background: '#0a0d14', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  Batal
                </button>
                <button
                  type="submit" disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Menyimpan...' : (editItem ? 'Update' : 'Simpan')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
