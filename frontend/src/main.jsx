import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

// GLOBAL CSS
import "./index.css";

// CONTEXT
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>

  </React.StrictMode>
);