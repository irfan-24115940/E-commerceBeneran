/**
 * ============================================
 * FILE: Invoice.jsx
 * ASSIGNED TO: Ahmad nur malik (24.11.5926)
 * JOBDESK: Halaman Workshit (Invoice/Receipt)
 * ============================================
 */

import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../data/muslimClothingProducts';
import { useEffect } from 'react';

function Invoice() {
  const { id } = useParams();
  const { orders } = useCart();
  const order = orders.find((o) => String(o.id) === id);

  useEffect(() => {
    // Auto trigger print when page loads if ?print=true
    const params = new URLSearchParams(window.location.search);
    if (params.get('print') === 'true') {
      setTimeout(() => window.print(), 1000);
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invoice Tidak Ditemukan</h1>
          <Link to="/orders" className="btn-premium">
            Kembali ke Pesanan
          </Link>
        </div>
      </div>
    );
  }

  const createdDate = new Date(order.createdAt);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-10 print:p-0 print:bg-white">
      {/* ── BACK BUTTON (Hidden on Print) ── */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link to="/orders" className="text-sm font-bold text-gray-500 hover:text-primary transition-colors">
          ← Kembali ke Pesanan
        </Link>
        <button onClick={() => window.print()} className="bg-primary text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg hover:bg-accent hover:text-primary transition-all">
          Cetak / Simpan PDF
        </button>
      </div>

      {/* ── INVOICE CONTAINER ── */}
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-[32px] overflow-hidden print:shadow-none print:rounded-none border border-gray-100">
        {/* Header Header */}
        <div className="bg-primary p-12 text-white flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">MISTCO</h1>
            <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-60">Official Fashion Invoice</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black mb-1 uppercase">INVOICE</h2>
            <p className="text-sm font-bold opacity-80">#MST-{String(order.id).slice(-8).toUpperCase()}</p>
          </div>
        </div>

        <div className="p-12">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-12 mb-16">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Diterbitkan Untuk:</p>
              <h3 className="text-lg font-black mb-1">{order.customer?.fullName}</h3>
              <p className="text-sm text-gray-500">{order.customer?.email}</p>
              <p className="text-sm text-gray-500">{order.customer?.phone}</p>
              <p className="text-sm text-gray-500 mt-2 max-w-xs">
                {order.customer?.address}, {order.customer?.province}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Detail Transaksi:</p>
              <p className="text-sm font-bold">
                Tanggal: <span className="font-normal text-gray-500">{createdDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </p>
              <p className="text-sm font-bold">
                Status: <span className="font-normal text-green-600 uppercase tracking-tighter">{order.status}</span>
              </p>
              <p className="text-sm font-bold">
                Metode: <span className="font-normal text-gray-500 uppercase tracking-tighter">{order.paymentMethod}</span>
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="mb-16">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Deskripsi Produk</th>
                  <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Qty</th>
                  <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Harga</th>
                  <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-6">
                      <p className="font-black text-sm">{item.title}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">{item.category}</p>
                    </td>
                    <td className="py-6 text-center font-bold text-sm">{item.quantity}</td>
                    <td className="py-6 text-right font-bold text-sm">{formatRupiah(item.price)}</td>
                    <td className="py-6 text-right font-black text-sm">{formatRupiah(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations */}
          <div className="flex justify-end mb-16">
            <div className="w-full max-w-xs space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest">Subtotal</span>
                <span className="font-black">{formatRupiah(order.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest">Shipping</span>
                <span className="font-black">{formatRupiah(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest">Pajak (11%)</span>
                <span className="font-black">{formatRupiah(order.tax)}</span>
              </div>
              <div className="pt-4 border-t-2 border-primary flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Total Bayar</span>
                <span className="text-2xl font-black text-primary">{formatRupiah(order.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Footer Footer */}
          <div className="pt-12 border-t border-dashed border-gray-200 text-center">
            <p className="text-sm font-black text-primary mb-2">Terima kasih atas pesanan Anda di MistCo!</p>
            <p className="text-[10px] text-gray-400 font-bold max-w-sm mx-auto leading-relaxed">Invoice ini diterbitkan secara sah melalui sistem MistCo Digital. Harap simpan invoice ini sebagai bukti pembelian resmi.</p>
          </div>
        </div>

        {/* Brand Bar */}
        <div className="h-2 bg-accent w-full" />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          @page { margin: 2cm; }
        }
      `,
        }}
      />
    </div>
  );
}

export default Invoice;
