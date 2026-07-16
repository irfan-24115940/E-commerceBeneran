/**
 * AdminProductsPage.jsx – CRUD Products untuk Admin
 */
import { useState, useEffect } from 'react';
import {
  fetchAdminProducts,
  fetchAdminCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/admin-api';

const formatRp = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n || 0);

const EMPTY_FORM = {
  title: '', description: '', categoryId: '', image: '', price: '', stock: '', badge: '',
};

export default function AdminProductsPage() {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [editItem, setEditItem]     = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [deleteId, setDeleteId]     = useState(null);
  const [search, setSearch]         = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([fetchAdminProducts(), fetchAdminCategories()])
      .then(([p, c]) => {
        setProducts(p?.products || []);
        setCategories(c?.categories || []);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditItem(p);
    setForm({
      title: p.title || '',
      description: p.description || '',
      categoryId: String(p.categoryId || ''),
      image: p.image || '',
      price: String(p.price || ''),
      stock: String(p.stock || ''),
      badge: p.badge || '',
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        image: form.image,
        price: Number(form.price),
        stock: Number(form.stock),
        badge: form.badge,
      };
      if (editItem) {
        await updateProduct(editItem.id, payload);
      } else {
        await createProduct(payload);
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
    if (!window.confirm('Hapus produk ini?')) return;
    try {
      await deleteProduct(id);
      setDeleteId(id);
      load();
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Manajemen</p>
          <h1 className="text-2xl font-black text-white">Products</h1>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-colors"
        >
          <span className="text-base">+</span> Add Product
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Cari produk..."
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
                  {['Image','Title','Category','Price','Stock','Description','Action'].map(h => (
                    <th key={h} className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-white/[0.02] transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <td className="px-4 py-3">
                      <img
                        src={p.image || 'https://via.placeholder.com/40'}
                        alt={p.title}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={e => { e.target.src = 'https://via.placeholder.com/40'; }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white font-semibold line-clamp-1 max-w-[160px]">{p.title}</p>
                      {p.badge && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">
                          {p.badge}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{p.categoryName || '-'}</td>
                    <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">{formatRp(p.price)}</td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-bold px-2 py-1 rounded-lg"
                        style={{
                          background: p.stock > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                          color: p.stock > 0 ? '#10b981' : '#ef4444',
                        }}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs max-w-[200px]">
                      <p className="line-clamp-2">{p.description || '-'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-gray-600 text-sm">
                      Tidak ada produk ditemukan.
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
            className="relative w-full max-w-xl rounded-2xl p-7 overflow-y-auto max-h-[90vh]"
            style={{ background: '#131720', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <h2 className="text-lg font-black text-white mb-6">
              {editItem ? 'Edit Product' : 'Add Product'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              {[
                { label: 'Image URL', key: 'image', placeholder: 'https://...', required: false },
                { label: 'Title *',  key: 'title',  placeholder: 'Nama produk', required: true },
              ].map(({ label, key, placeholder, required }) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-gray-400 mb-1">{label}</label>
                  <input
                    type="text"
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    required={required}
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    style={{ background: '#0a0d14', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Deskripsi produk"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  style={{ background: '#0a0d14', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Category</label>
                <select
                  value={form.categoryId}
                  onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ background: '#0a0d14', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <option value="">-- Pilih kategori --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Price *</label>
                  <input
                    type="number" min="0" required
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="150000"
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    style={{ background: '#0a0d14', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Stock</label>
                  <input
                    type="number" min="0"
                    value={form.stock}
                    onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                    placeholder="0"
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    style={{ background: '#0a0d14', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Badge</label>
                <input
                  type="text"
                  value={form.badge}
                  onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                  placeholder="New, Sale, Hot..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ background: '#0a0d14', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
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
