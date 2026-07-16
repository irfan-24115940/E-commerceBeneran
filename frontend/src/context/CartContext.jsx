/**
 * ============================================
 * FILE: CartContext.jsx
 * ASSIGNED TO: Muhammad Dhani Favian (24.11.5944)
 * JOBDESK: Halaman Kranjang (Cart)
 * ============================================
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { useToast } from "./ToastContext";
import { getCart, addToCart as apiAddToCart, updateQuantity as apiUpdateQuantity, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart } from "../services/cart-service";
import { saveTransaction, getTransactions } from "../services/transaction-service";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { addToast } = useToast();

  const [cartItems, setCartItems] = useState([]);
  
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchCart = async () => {
      const items = await getCart();
      if (isMounted) setCartItems(items);
    };

    const fetchOrders = async () => {
      const userOrders = await getTransactions();
      if (isMounted) setOrders(userOrders);
    };

    const handleAuthChange = () => {
      // When auth status changes, re-fetch cart
      fetchCart();
      fetchOrders();
    };

    // Initial fetch
    fetchCart();
    fetchOrders();

    // Listen for auth changes
    window.addEventListener('authUpdated', handleAuthChange);

    return () => {
      isMounted = false;
      window.removeEventListener('authUpdated', handleAuthChange);
    };
  }, []);

  const addToCart = async (product) => {
    const success = await apiAddToCart(product, 1);
    if (success) {
      setCartItems((currentCart) => {
        const existingItem = currentCart.find((item) => item.id === product.id);
        if (existingItem) {
          return currentCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...currentCart, { ...product, quantity: 1 }];
      });
    }
  };

  const decreaseCartItem = async (id) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    if (item.quantity === 1) {
      const success = await apiRemoveFromCart(id);
      if (success) {
        setCartItems(curr => curr.filter(i => i.id !== id));
        addToast("Produk dihapus dari keranjang", "info");
      }
    } else {
      const success = await apiUpdateQuantity(id, item.quantity - 1);
      if (success) {
        setCartItems(curr => curr.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i));
      }
    }
  };

  const removeFromCart = async (id) => {
    const success = await apiRemoveFromCart(id);
    if (success) {
      setCartItems(curr => curr.filter(i => i.id !== id));
      addToast("Produk dihapus", "info");
    }
  };

  const clearCart = async () => {
    const success = await apiClearCart();
    if (success) setCartItems([]);
  };

  const placeOrder = async (order) => {
    const newOrder = await saveTransaction(order);
    if (newOrder) {
      setOrders(curr => [newOrder, ...curr]);
      await clearCart();
      addToast("Pesanan Berhasil Dibuat!", "success");
      return newOrder;
    } else {
      addToast("Gagal membuat pesanan", "error");
      return null;
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        orders,
        addToCart,
        decreaseCartItem,
        removeFromCart,
        clearCart,
        placeOrder,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}