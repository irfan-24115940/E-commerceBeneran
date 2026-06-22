/**
 * ============================================
 * FILE: Cart.jsx
 * ASSIGNED TO: Muhammad Dhani Favian (24.11.5944)
 * JOBDESK: Halaman Kranjang (Cart)
 * ============================================
 */

import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";
import { formatRupiah } from "../data/muslimClothingProducts";

function Cart() {
  const {
    cartItems,
    decreaseCartItem,
    addToCart,
    removeFromCart,
    clearCart,
    totalPrice,
  } = useCart();

  const shipping = cartItems.length > 0 ? 15000 : 0;
  const tax = totalPrice * 0.11;
  const grandTotal = totalPrice + shipping + tax;

  return (
    <main id="cart-page" className="pb-32">
      
      {/* ── CHECKOUT PROGRESS (EXPERT LOOK) ── */}
      <div className="max-w-xl mx-auto mb-16 px-4 animate-fade-in">
         <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-white/5 -translate-y-1/2 z-0" />
            <div className="absolute top-1/2 left-0 w-[33%] h-0.5 bg-accent -translate-y-1/2 z-0" />
            
            {[
              { l: "Bag", active: true, done: false },
              { l: "Delivery", active: false, done: false },
              { l: "Payment", active: false, done: false }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center gap-2">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs border-4 ${
                   step.active 
                   ? "bg-accent text-primary border-primary" 
                   : "bg-white dark:bg-[#0a0a16] text-gray-400 border-gray-200 dark:border-white/5"
                 }`}>
                    {i + 1}
                 </div>
                 <span className={`text-[10px] font-black uppercase tracking-widest ${step.active ? "text-accent" : "text-gray-400"}`}>{step.l}</span>
              </div>
            ))}
         </div>
      </div>

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div className="text-center md:text-left">
          <span className="section-tag">Ringkasan Belanja</span>
          <h1 className="section-title-premium">Keranjang Belanja</h1>
          <p className="section-subtitle">
            {cartItems.length > 0
              ? `Anda memiliki ${cartItems.length} item pilihan dalam keranjang.`
              : "Siapkan diri Anda untuk gaya baru."}
          </p>
        </div>
        
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Clear Bag
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        /* ── EMPTY STATE ── */
        <div className="card-modern py-32 text-center animate-scale-up border-dashed border-2 border-gray-200 dark:border-white/10">
          <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-8 animate-float">
             <span className="text-5xl">🛍️</span>
          </div>
          <h2 className="text-3xl font-black mb-4">Tas Belanja Kosong</h2>
          <p className="text-gray-400 max-w-sm mx-auto mb-10">Koleksi terbaru kami sedang menunggu untuk melengkapi lemari pakaian Anda.</p>
          <Link to="/products" className="btn-premium px-12 py-4">Mulai Eksplorasi →</Link>
        </div>
      ) : (
        /* ── CART GRID ── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Items List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col gap-6">
              {cartItems.map((item, i) => (
                <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                   <CartItem
                     item={item}
                     onDecrease={() => decreaseCartItem(item.id)}
                     onIncrease={() => addToCart(item)}
                     onRemove={() => removeFromCart(item.id)}
                   />
                </div>
              ))}
            </div>

            <div className="pt-8">
               <Link
                 to="/products"
                 className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-accent hover:gap-5 transition-all"
               >
                 <span>←</span> Terus Berbelanja
               </Link>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="card-modern p-8 border border-accent/20 bg-accent/5">
              <h2 className="text-xl font-black mb-8 border-b border-gray-100 dark:border-white/5 pb-4">
                Summary
              </h2>

              <div className="space-y-6 mb-8">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest">Subtotal</span>
                    <span className="font-black text-lg">{formatRupiah(totalPrice)}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest">Shipping</span>
                    <span className="font-black text-lg">{formatRupiah(shipping)}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest">Tax (11%)</span>
                    <span className="font-black text-lg">{formatRupiah(tax)}</span>
                 </div>
              </div>

              <div className="py-6 border-y border-dashed border-gray-200 dark:border-white/10 mb-8">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-accent">Grand Total</span>
                    <span className="text-3xl font-black text-gradient">{formatRupiah(grandTotal)}</span>
                 </div>
              </div>

              {/* Promo Code Entry */}
              <div className="mb-8">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Promo Code</p>
                 <div className="flex gap-2 p-1.5 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                    <input 
                      type="text" placeholder="MistCo2024"
                      className="bg-transparent border-none outline-none px-3 text-xs font-bold w-full"
                    />
                    <button className="bg-primary text-white text-[10px] font-black px-4 py-2 rounded-xl hover:bg-accent hover:text-primary transition-all">APPLY</button>
                 </div>
              </div>

              <Link
                to="/checkout"
                className="btn-premium w-full py-5 text-base flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(201,169,110,0.3)]"
              >
                Checkout Now
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                   <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
                </svg>
              </Link>

              {/* Trust Badges */}
              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5 flex flex-wrap justify-center gap-4 opacity-40">
                 {["VISA", "MC", "STRIPE", "PAYPAL"].map(b => (
                   <span key={b} className="text-[10px] font-black tracking-widest">{b}</span>
                 ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Cart;