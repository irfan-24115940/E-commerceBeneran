import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MENU = [
  { to: "/admin",           icon: "📊", label: "Dashboard",  exact: true  },
  { to: "/admin/products",  icon: "📦", label: "Products"               },
  { to: "/admin/categories",icon: "🏷️", label: "Categories"             },
  { to: "/admin/orders",    icon: "🛒", label: "Orders"                 },
  { to: "/admin/users",     icon: "👥", label: "Users"                  },
  { to: "/admin/reports",   icon: "📈", label: "Reports"                },
];

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-black text-white shadow-md"
        : "text-gray-500 hover:bg-gray-100 hover:text-black"
    }`;

  const Sidebar = () => (
    <aside
      className={`
        flex flex-col h-full bg-white border-r border-gray-200
        transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-200 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-sm font-black text-white">
              M
            </div>
            <div>
              <p className="text-black font-black text-sm tracking-tight">MistCo</p>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-sm font-black text-white mx-auto">
            M
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-7 h-7 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 items-center justify-center text-gray-400 hover:text-black transition-colors shrink-0"
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {MENU.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={linkClass}
            onClick={() => setMobileOpen(false)}
          >
            <span className="text-lg shrink-0">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + Back to store */}
      <div className="px-3 py-4 border-t border-gray-200 shrink-0">
        {!collapsed && (
          <div className="px-4 py-3 rounded-xl bg-gray-50 mb-3 border border-gray-100">
            <p className="text-black text-xs font-bold truncate">{user?.name || "Admin"}</p>
            <p className="text-gray-500 text-[10px] truncate">{user?.email || ""}</p>
          </div>
        )}
        
        {/* Back to store using standard anchor tag to reload the page to index.html */}
        <a
          href="/"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all duration-200 ${collapsed ? "justify-center" : ""}`}
        >
          <span className="text-lg shrink-0">🏪</span>
          {!collapsed && <span>Kembali ke Toko</span>}
        </a>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full shadow-sm z-10">
        <Sidebar />
      </div>

      {/* Mobile Overlay Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-64 h-full shadow-2xl">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0 shadow-sm z-0">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-black transition-colors"
          >
            ☰
          </button>
          <div className="hidden lg:block">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
              Admin Dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-sm font-black shadow-sm">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="hidden sm:block">
              <p className="text-black text-xs font-bold">{user?.name || "Admin"}</p>
              <p className="text-gray-500 text-[10px]">Administrator</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
