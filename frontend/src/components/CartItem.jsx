/**
 * ============================================
 * FILE: CartItem.jsx
 * ASSIGNED TO: Muhammad Dhani Favian (24.11.5944)
 * JOBDESK: Halaman Kranjang (Cart Items)
 * ============================================
 */

import { formatRupiah } from "../data/muslimClothingProducts";

function CartItem({ item, onDecrease, onIncrease, onRemove }) {
  return (
    <div
      id={`cart-item-${item.id}`}
      className="card-modern group flex flex-col sm:flex-row items-center gap-6 p-6 animate-fade-in-up"
    >
      {/* Image Container with Accent Border on Hover */}
      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-transparent group-hover:border-accent transition-colors duration-300">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Info Section */}
      <div className="flex-1 min-w-0 w-full text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
           <span className="section-tag !mb-0 !py-0.5">Premium Item</span>
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.category?.replace(/-/g, " ")}</span>
        </div>
        <h2 className="font-extrabold text-lg text-gradient line-clamp-1 mb-1">
          {item.title}
        </h2>
        <p className="text-xl font-black mb-4">
          {formatRupiah(item.price)}
        </p>

        {/* Advanced Qty Controls */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-auto">
          <div className="flex items-center bg-gray-100 dark:bg-white/5 rounded-xl p-1 border border-gray-200 dark:border-white/5">
            <button
              onClick={onDecrease}
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
            >
              −
            </button>
            <span className="w-10 text-center font-black text-sm">
              {item.quantity}
            </span>
            <button
              onClick={onIncrease}
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-gray-500 hover:text-accent hover:bg-accent/10 transition-all"
            >
              +
            </button>
          </div>
          <div className="h-4 w-[1px] bg-gray-200 dark:bg-white/10 hidden sm:block" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Subtotal: <span className="text-accent ml-1">{formatRupiah(item.price * item.quantity)}</span>
          </span>
        </div>
      </div>

      {/* Modern Remove Button */}
      <button
        onClick={onRemove}
        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all bg-gray-100 dark:bg-white/5 text-gray-400 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20"
        title="Remove Item"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
    </div>
  );
}

export default CartItem;