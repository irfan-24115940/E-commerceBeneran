/**
 * ============================================
 * FILE: Orders.jsx
 * ASSIGNED TO: Andika Cavllo B (24.11.5950)
 * JOBDESK: Halaman Riwayat Transaksi
 * ============================================
 */

import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatRupiah } from "../data/muslimClothingProducts";

const STATUS_COLORS = {
  Processing: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", icon: "⏳" },
  Shipped:    { bg: "rgba(99,102,241,0.1)",  color: "#6366f1", icon: "🚚" },
  Delivered:  { bg: "rgba(16,185,129,0.1)",  color: "#10b981", icon: "✅" },
  paid:       { bg: "rgba(16,185,129,0.1)",  color: "#10b981", icon: "✅" },
  Cancelled:  { bg: "rgba(239,68,68,0.1)",   color: "#ef4444", icon: "❌" },
};

const STEPS = [
  { l: "Confirmed", d: "Pesanan diterima" },
  { l: "Processing", d: "Sedang disiapkan" },
  { l: "Shipped", d: "Dalam pengiriman" },
  { l: "Delivered", d: "Sampai tujuan" }
];

function Orders() {
  const { orders } = useCart();

  return (
    <main id="orders-page" className="pb-32">
      
      {/* ── DASHBOARD HEADER ── */}
      <div className="mb-16">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
           <div>
             <span className="section-tag">Account Dashboard</span>
             <h1 className="section-title-premium !mb-2">Riwayat Transaksi</h1>
             <p className="text-gray-400 text-sm font-medium">Lacak dan kelola semua pesanan eksklusif Anda di sini.</p>
           </div>
           <div className="flex gap-4">
              <div className="px-6 py-4 rounded-[24px] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 text-center">
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Pesanan</p>
                 <p className="text-2xl font-black">{orders.length}</p>
              </div>
              <div className="px-6 py-4 rounded-[24px] bg-accent/10 border border-accent/20 text-center">
                 <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-1">Status Aktif</p>
                 <p className="text-2xl font-black text-accent">{orders.filter(o => o.status === 'Processing').length}</p>
              </div>
           </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="card-modern py-32 text-center animate-scale-up border-dashed border-2 border-gray-200 dark:border-white/10">
          <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-8 animate-float">
             <span className="text-5xl">📦</span>
          </div>
          <h2 className="text-3xl font-black mb-4">Belum Ada Pesanan</h2>
          <p className="text-gray-400 max-w-sm mx-auto mb-10">Mulai langkah gaya Anda sekarang dengan koleksi terbaik kami.</p>
          <Link to="/products" className="btn-premium px-12 py-4">Mulai Belanja →</Link>
        </div>
      ) : (
        <div className="space-y-10">
          {orders.slice().reverse().map((order, i) => {
            const status = STATUS_COLORS[order.status] || STATUS_COLORS.Processing;
            const createdDate = new Date(order.createdAt);

            return (
              <div key={order.id} className="card-modern !p-0 overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                
                {/* Order Top Bar */}
                <div className="bg-gray-50 dark:bg-white/5 px-8 py-6 flex flex-wrap items-center justify-between gap-6 border-b border-gray-100 dark:border-white/5">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner" style={{ background: status.bg }}>
                         {status.icon}
                      </div>
                      <div>
                         <h3 className="text-lg font-black tracking-tighter">Order #MST-{String(order.id).slice(-6).toUpperCase()}</h3>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                           {createdDate.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}
                         </p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <span
                       className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest"
                       style={{ background: status.bg, color: status.color }}
                     >
                       {order.status}
                     </span>
                     <Link
                       to={`/invoice/${order.id}`}
                       className="px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all hover:bg-accent hover:text-primary hover:border-accent"
                       style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                     >
                       Invoice →
                     </Link>
                   </div>
                </div>

                {/* Order Content */}
                <div className="p-8 lg:p-10">
                   {/* Modern Timeline */}
                   <div className="mb-12 relative">
                      <div className="absolute top-4 left-0 w-full h-[1px] bg-gray-200 dark:bg-white/10 z-0" />
                      <div className="absolute top-4 left-0 w-[25%] h-[2px] bg-accent z-0" />
                      
                      <div className="flex justify-between relative z-10">
                         {STEPS.map((step, idx) => (
                           <div key={idx} className="flex flex-col items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border-4 transition-all duration-500 ${
                                idx === 0 
                                ? "bg-accent text-primary border-primary" 
                                : "bg-white dark:bg-[#0a0a16] text-gray-400 border-gray-100 dark:border-white/5"
                              }`}>
                                 {idx === 0 ? "✓" : idx + 1}
                              </div>
                              <div className="text-center">
                                 <p className={`text-[9px] font-black uppercase tracking-widest ${idx === 0 ? "text-accent" : "text-gray-400"}`}>{step.l}</p>
                                 <p className="text-[8px] font-bold text-gray-500 hidden sm:block">{step.d}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {/* Products */}
                      <div className="space-y-6">
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Items Ordered ({order.items?.length})</p>
                         <div className="space-y-4">
                            {order.items?.map(item => (
                              <div key={item.id} className="flex items-center gap-5 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-accent/20 transition-all group">
                                 <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-black text-gradient truncate">{item.title}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                      {item.quantity} Unit × {formatRupiah(item.price)}
                                    </p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-sm font-black">{formatRupiah(item.price * item.quantity)}</p>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>

                      {/* Delivery Detail Card */}
                      <div className="card-modern !bg-accent/5 border-accent/10 p-8">
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-6">Delivery Details</p>
                         <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            {[
                              { l: "Recipient", v: order.customer?.fullName },
                              { l: "Phone", v: order.customer?.phone },
                              { l: "Location", v: order.customer?.province },
                              { l: "Payment", v: order.paymentMethod?.toUpperCase() }
                            ].map(d => (
                              <div key={d.l}>
                                 <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">{d.l}</p>
                                 <p className="text-xs font-black">{d.v || "N/A"}</p>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>

                {/* Order Footer */}
                <div className="bg-gray-50 dark:bg-white/5 px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-100 dark:border-white/5">
                   <div className="flex gap-8">
                      <div className="text-center sm:text-left">
                         <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Subtotal</p>
                         <p className="text-sm font-black">{formatRupiah(order.total)}</p>
                      </div>
                      <div className="text-center sm:text-left">
                         <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Shipping + Tax</p>
                         <p className="text-sm font-black">{formatRupiah(order.shipping + order.tax)}</p>
                      </div>
                   </div>
                   <div className="flex flex-col items-center sm:items-end">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-1">Total Payment</p>
                      <p className="text-3xl font-black text-gradient">{formatRupiah(order.grandTotal)}</p>
                   </div>
                </div>
              </div>
            );
          })}

          <div className="flex justify-center pt-10">
             <Link to="/products" className="btn-premium px-12 py-5 text-base flex items-center gap-3">
               <span className="text-xl">+</span> Buat Pesanan Baru
             </Link>
          </div>
        </div>
      )}
    </main>
  );
}

export default Orders;