/**
 * ============================================
 * FILE: WishlistContext.jsx
 * ASSIGNED TO: Andika Cavllo B (24.11.5950)
 * JOBDESK: Halaman Favorit
 * ============================================
 */

import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";
import { getWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from "../services/wishlist-service";
import { useToast } from "./ToastContext";

const WishlistContext = createContext();

export function WishlistProvider({
  children,
}) {
  const [wishlist, setWishlist] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const fetchWishlist = async () => {
      const items = await getWishlist();
      if (isMounted) setWishlist(items);
    };

    const handleAuthChange = () => {
      // When auth status changes, re-fetch wishlist
      fetchWishlist();
    };

    // Initial fetch
    fetchWishlist();

    // Listen for auth changes
    window.addEventListener('authUpdated', handleAuthChange);

    return () => {
      isMounted = false;
      window.removeEventListener('authUpdated', handleAuthChange);
    };
  }, []);

  // ADD TO WISHLIST
  const addToWishlist = async (product) => {
    const success = await apiAddToWishlist(product);
    if (success) {
      setWishlist((prev) => {
        const existingItem = prev.find((item) => item.id === product.id);
        if (!existingItem) {
          addToast("Produk ditambahkan ke favorit", "success");
          return [...prev, product];
        }
        return prev;
      });
    }
  };

  // REMOVE WISHLIST
  const removeFromWishlist = async (id) => {
    const success = await apiRemoveFromWishlist(id);
    if (success) {
      setWishlist((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// CUSTOM HOOK
export function useWishlist() {
  return useContext(WishlistContext);
}