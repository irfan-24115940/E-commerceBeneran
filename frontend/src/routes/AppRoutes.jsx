import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

// PAGES
import Home            from "../pages/Home";
import Products        from "../pages/Products";
import Category        from "../pages/Category";
import Favorites       from "../pages/Favorites";
import Cart            from "../pages/Cart";
import Checkout        from "../pages/Checkout";
import Orders          from "../pages/Orders";
import Invoice         from "../pages/Invoice";
import Profile         from "../pages/Profile";
import About           from "../pages/About";
import Login           from "../pages/Login";
import Register        from "../pages/Register";
import AdminDashboard  from "../pages/AdminDashboard";

// COMPONENT
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* ── AUTH ROUTES (No Navbar/Footer) ── */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── STORE ROUTES (With MainLayout) ── */}
        <Route path="/*" element={
          <MainLayout>
            <Routes>
              <Route path="/"                        element={<Home />} />
              <Route path="/products"                element={<Products />} />
              <Route path="/about"                   element={<About />} />
              
              {/* Category routes */}
              <Route path="/category"                element={<Category />} />
              <Route path="/category/:categoryName"  element={<Category />} />

              {/* Favorites & Cart (public) */}
              <Route path="/favorites"               element={<Favorites />} />
              <Route path="/cart"                    element={<Cart />} />

              {/* ── PROTECTED ROUTES ── */}
              <Route path="/checkout" element={
                <ProtectedRoute><Checkout /></ProtectedRoute>
              } />

              <Route path="/orders" element={
                <ProtectedRoute><Orders /></ProtectedRoute>
              } />

              <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
              } />

              <Route path="/invoice/:id" element={
                <ProtectedRoute><Invoice /></ProtectedRoute>
              } />

              <Route path="/admin" element={
                <ProtectedRoute><AdminDashboard /></ProtectedRoute>
              } />

              {/* 404 - Redirect to home or a dedicated 404 page */}
              <Route path="*" element={<Home />} />
            </Routes>
          </MainLayout>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;