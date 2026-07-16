/**
 * ============================================
 * FILE: Checkout.jsx
 * ASSIGNED TO: Ahmad nur malik (24.11.5926)
 * JOBDESK: Halaman Checkout
 * ============================================
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../data/muslimClothingProducts';

const PROVINCES = ['DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'DI Yogyakarta', 'Banten', 'Bali', 'Sumatera Utara', 'Sulawesi Selatan', 'Kalimantan Timur'];

const PAYMENT_METHODS = [
  { id: 'transfer', label: 'Bank Transfer', icon: '🏦', desc: 'Verifikasi manual 1x24 jam', color: '#3b82f6' },
  { id: 'gopay', label: 'GoPay', icon: '💚', desc: 'Konfirmasi instan', color: '#10b981' },
  { id: 'ovo', label: 'OVO', icon: '💜', desc: 'Konfirmasi instan', color: '#8b5cf6' },
  { id: 'dana', label: 'Dana', icon: '💙', desc: 'Konfirmasi instan', color: '#3b82f6' },
  { id: 'cod', label: 'Cash On Delivery', icon: '💵', desc: 'Bayar di tempat', color: '#f59e0b' },
];

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, placeOrder } = useCart();

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    province: '',
    postalCode: '',
    notes: '',
  });
  const [payment, setPayment] = useState('transfer');

  const shipping = 15000;
  const tax = totalPrice * 0.11;
  const grandTotal = totalPrice + shipping + tax;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.address || !form.province) {
      setError('Mohon lengkapi semua field yang wajib diisi.');
      return;
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const result = await placeOrder({
      customer: { ...form },
      items: cartItems,
      total: totalPrice,
      grandTotal,
      shipping,
      tax,
      paymentMethod: payment,
    });
    if (result) {
      setStep(3);
      window.scrollTo(0, 0);
    }
  };

  if (cartItems.length === 0 && step !== 3) {
    return (
      <main className="text-center py-32 bg-gray-50 dark:bg-[#0a0a16] min-h-screen">
        <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-8 animate-float">
          <span className="text-5xl">🛒</span>
        </div>
        <h1 className="text-3xl font-black mb-4">Keranjang Kosong</h1>
        <p className="text-gray-400 mb-10 max-w-xs mx-auto">Anda belum menambahkan produk apapun untuk dicheckout.</p>
        <Link to="/products" className="btn-premium px-10 py-4">
          Mulai Belanja →
        </Link>
      </main>
    );
  }

  if (step === 3) {
    return (
      <main className="flex justify-center py-20 px-6 bg-gray-50 dark:bg-[#0a0a16] min-h-screen">
        <div className="card-modern text-center p-12 max-w-xl w-full animate-scale-up border-accent/20">
          <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-8 text-5xl animate-bounce-slow">✅</div>
          <h1 className="text-4xl font-black mb-4 tracking-tighter">Pesanan Diterima!</h1>
          <p className="text-gray-500 mb-10 text-lg">
            Terima kasih, <strong className="text-primary dark:text-white">{form.fullName}</strong>. Pesanan Anda <span className="text-accent font-bold">#MST-{Math.floor(Math.random() * 9000) + 1000}</span> sedang kami siapkan.
          </p>
          <div className="rounded-[32px] p-8 mb-10 text-left bg-gray-50 dark:bg-white/5 border-2 border-gray-300 dark:border-white/20">
            <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-gray-300 dark:border-white/20">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Total Terbayar</span>
              <span className="text-2xl font-black text-gradient">{formatRupiah(grandTotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Metode</span>
              <span className="font-bold text-accent uppercase tracking-tighter">{PAYMENT_METHODS.find((p) => p.id === payment)?.label}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/orders" className="btn-premium flex-1 py-4">
              Status Pesanan
            </Link>
            <Link to="/" className="flex-1 py-4 rounded-2xl bg-gray-100 dark:bg-white/5 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">
              Beranda
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="checkout-page" className="pb-32">
      {/* ── PROGRESS BAR (CONSISTENT WITH CART) ── */}
      <div className="max-w-xl mx-auto mb-16 px-4 animate-fade-in">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-white/5 -translate-y-1/2 z-0" />
          <div className="absolute top-1/2 left-0 w-[66%] h-0.5 bg-accent -translate-y-1/2 z-0 transition-all duration-700" />

          {[
            { l: 'Bag', active: true, done: true },
            { l: 'Delivery', active: step === 1, done: step > 1 },
            { l: 'Payment', active: step === 2, done: false },
          ].map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs border-4 transition-all duration-500 ${
                  s.active || s.done ? 'bg-accent text-primary border-primary' : 'bg-white dark:bg-[#0a0a16] text-gray-400 border-gray-200 dark:border-white/5'
                }`}
              >
                {s.done ? '✓' : i + 1}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${s.active || s.done ? 'text-accent' : 'text-gray-400'}`}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* ── LEFT PANEL ── */}
        <div className="lg:col-span-8">
          {/* STEP 1: SHIPPING */}
          {step === 1 && (
            <div className="animate-fade-in-up">
              <div className="mb-10">
                <span className="section-tag">Logistik</span>
                <h2 className="section-title-premium !mb-2 text-3xl">Informasi Pengiriman</h2>
                <p className="text-gray-400 text-sm">Pastikan alamat yang Anda masukkan sudah akurat.</p>
              </div>

              <form onSubmit={handleNextStep} className="card-modern p-10 space-y-8">
                {error && <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold animate-shake">⚠️ {error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 ml-1 group-focus-within:text-accent transition-colors">Nama Lengkap *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-accent transition-all font-bold"
                      style={{ background: 'var(--surface-2)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
                      placeholder="Contoh: Muhammad Dhani"
                    />
                  </div>
                  <div className="group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 ml-1 group-focus-within:text-accent transition-colors">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-accent transition-all font-bold"
                      style={{ background: 'var(--surface-2)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
                      placeholder="dhani@example.com"
                    />
                  </div>
                  <div className="group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 ml-1 group-focus-within:text-accent transition-colors">No. Telepon *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-accent transition-all font-bold"
                      style={{ background: 'var(--surface-2)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
                      placeholder="0812xxxx"
                    />
                  </div>
                  <div className="group relative">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 ml-1 group-focus-within:text-accent transition-colors">Provinsi *</label>
                    <div className="relative">
                      <select
                        name="province"
                        value={form.province}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-accent transition-all font-bold appearance-none"
                        style={{ background: 'var(--surface-2)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
                      >
                        <option value="" className="dark:bg-[#1a1a2e]">
                          Pilih Provinsi
                        </option>
                        {PROVINCES.map((p) => (
                          <option key={p} value={p} className="dark:bg-[#1a1a2e]">
                            {p}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 ml-1 group-focus-within:text-accent transition-colors">Kode Pos</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={form.postalCode}
                      onChange={handleChange}
                      className="w-full rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-accent transition-all font-bold"
                      style={{ background: 'var(--surface-2)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
                      placeholder="12345"
                    />
                  </div>
                  <div className="md:col-span-2 group">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 ml-1 group-focus-within:text-accent transition-colors">Alamat Lengkap *</label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-accent transition-all font-bold resize-none"
                      style={{ background: 'var(--surface-2)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}
                      placeholder="Nama Jalan, No. Rumah, RT/RW..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Link to="/cart" className="flex-1 text-center py-5 rounded-2xl bg-gray-100 dark:bg-white/5 font-black text-xs uppercase tracking-widest">
                    Back to Cart
                  </Link>
                  <button type="submit" className="flex-[2] btn-premium py-5">
                    Proceed to Payment
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: PAYMENT */}
          {step === 2 && (
            <div className="animate-fade-in-up">
              <div className="mb-10">
                <span className="section-tag">Secure Gateway</span>
                <h2 className="section-title-premium !mb-2 text-3xl">Metode Pembayaran</h2>
                <p className="text-gray-400 text-sm">Pilih metode pembayaran yang paling nyaman bagi Anda.</p>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {PAYMENT_METHODS.map((m) => (
                    <label
                      key={m.id}
                      className={`group card-modern p-8 flex flex-col gap-4 cursor-pointer transition-all duration-500 relative overflow-hidden ${payment === m.id ? 'ring-2 ring-accent border-transparent' : 'hover:border-accent/40'}`}
                    >
                      {payment === m.id && <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-bl-[100px] animate-pulse" />}
                      <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={() => setPayment(m.id)} className="hidden" />

                      <div className="flex items-center justify-between">
                        <div className="text-4xl">{m.icon}</div>
                        {payment === m.id && <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-primary text-[10px] font-black shadow-lg">✓</div>}
                      </div>

                      <div>
                        <h3 className="text-lg font-black tracking-tight">{m.label}</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{m.desc}</p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: m.color }} />
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Secure Payment Active</span>
                      </div>
                    </label>
                  ))}
                </div>

                {/* VISUAL CREDIT CARD PLACEHOLDER (Only for Expert Look) */}
                {payment === 'transfer' && (
                  <div className="card-modern p-10 bg-gradient-to-br from-primary to-[#2d2d6e] text-white overflow-hidden relative animate-scale-up">
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-accent/20 rounded-full blur-[100px]" />
                    <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                      <div className="flex justify-between items-start">
                        <div className="text-xs font-black tracking-[0.3em] uppercase opacity-60">MistCo Exclusive Card</div>
                        <div className="w-12 h-8 rounded bg-accent/40 backdrop-blur" />
                      </div>
                      <div>
                        <p className="text-2xl font-black tracking-[0.2em] mb-4">**** **** **** 5944</p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Account Holder</p>
                            <p className="text-sm font-black uppercase tracking-widest">MISTCO DIGITAL SOLUTIONS</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Expires</p>
                            <p className="text-sm font-black uppercase tracking-widest">12/26</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-8">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-5 rounded-2xl bg-gray-100 dark:bg-white/5 font-black text-xs uppercase tracking-widest">
                    Back to Delivery
                  </button>
                  <button type="submit" className="flex-[2] btn-premium py-5 text-base flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(201,169,110,0.3)]">
                    Confirm & Pay Now
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* ── SIDEBAR SUMMARY ── */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="card-modern p-8 bg-white dark:bg-white/5">
            <h2 className="text-xl font-black mb-8 border-b border-gray-100 dark:border-white/5 pb-4">Pesanan Anda</h2>
            <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-gray-100 dark:border-white/10">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-gradient line-clamp-1 mb-1">{item.title}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-black shrink-0">{formatRupiah(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4 pt-6 border-t border-dashed border-gray-200 dark:border-white/10 mb-8">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-bold uppercase tracking-widest">Subtotal</span>
                <span className="font-black">{formatRupiah(totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-bold uppercase tracking-widest">Pengiriman</span>
                <span className="font-black">{formatRupiah(shipping)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-bold uppercase tracking-widest">PPN (11%)</span>
                <span className="font-black">{formatRupiah(tax)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-white/5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Grand Total</span>
                <span className="text-2xl font-black text-gradient">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 flex gap-4 items-start animate-fade-in">
              <div className="text-xl">🛡️</div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-1">Secure Checkout</p>
                <p className="text-[9px] text-gray-500 leading-relaxed font-bold">Data transaksi Anda dilindungi dengan enkripsi SSL 256-bit standar internasional.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Checkout;
