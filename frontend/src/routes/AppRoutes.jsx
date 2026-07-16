import { HashRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

// PAGES – Customer
import Home            from "../pages/Home";
import Products        from "../pages/Products";
import ProductDetail   from "../pages/ProductDetail";
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

// PAGES – Admin
import AdminDashboard      from "../pages/AdminDashboard";
import AdminProductsPage   from "../pages/admin/AdminProductsPage";
import AdminCategoriesPage from "../pages/admin/AdminCategoriesPage";
import AdminOrdersPage     from "../pages/admin/AdminOrdersPage";
import AdminUsersPage      from "../pages/admin/AdminUsersPage";
import AdminReportsPage    from "../pages/admin/AdminReportsPage";

// ROUTE GUARDS
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute     from "../components/AdminRoute";

function AppRoutes() {
  return (
    <HashRouter>
      <Routes>

        {/* ── AUTH ROUTES (No Navbar/Footer) ── */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── ADMIN ROUTES (AdminLayout + AdminRoute guard) ── */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminRoute>
        } />
        <Route path="/admin/products" element={
          <AdminRoute>
            <AdminLayout>
              <AdminProductsPage />
            </AdminLayout>
          </AdminRoute>
        } />
        <Route path="/admin/categories" element={
          <AdminRoute>
            <AdminLayout>
              <AdminCategoriesPage />
            </AdminLayout>
          </AdminRoute>
        } />
        <Route path="/admin/orders" element={
          <AdminRoute>
            <AdminLayout>
              <AdminOrdersPage />
            </AdminLayout>
          </AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute>
            <AdminLayout>
              <AdminUsersPage />
            </AdminLayout>
          </AdminRoute>
        } />
        <Route path="/admin/reports" element={
          <AdminRoute>
            <AdminLayout>
              <AdminReportsPage />
            </AdminLayout>
          </AdminRoute>
        } />

        {/* ── STORE ROUTES (With MainLayout) ── */}
        <Route path="/*" element={
          <MainLayout>
            <Routes>
              <Route path="/"                        element={<Home />} />
              <Route path="/products"                element={<Products />} />
              <Route path="/products/:id"            element={<ProductDetail />} />
              <Route path="/about"                   element={<About />} />

              {/* Category routes */}
              <Route path="/category"                element={<Category />} />
              <Route path="/category/:categoryName"  element={<Category />} />

              {/* Favorites & Cart (public) */}
              <Route path="/favorites"               element={<Favorites />} />
              <Route path="/cart"                    element={<Cart />} />

              {/* ── PROTECTED CUSTOMER ROUTES ── */}
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

              {/* 404 - Redirect to home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </MainLayout>
        } />

      </Routes>
    </HashRouter>
  );
}

export default AppRoutes;