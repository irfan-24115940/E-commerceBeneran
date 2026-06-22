/**
 * ============================================
 * FILE: About.jsx
 * ASSIGNED TO: Muhammad Farrukh al ghifari (24.11.5936)
 * JOBDESK: About Us / Halaman Tim Pengembang
 * ============================================
 */

import { useState } from 'react';

const teamMembers = [
  {
    id: 1,
    nim: '24.11.5944',
    name: 'Muhammad Dhani Favian',
    role: 'Lead Developer',
    avatar: '👨🏻‍💻',
    color: '#6366f1',
    jobdesk: 'Menu Pencarian, Header & Footer, Keranjang',
    bio: 'Dhani adalah arsitek utama di balik MIST.CO. Dengan keahlian mendalam dalam JavaScript dan arsitektur sistem, ia memastikan performa website tetap optimal dan stabil.',
    files: ['SearchBar.jsx', 'Navbar.jsx', 'Footer.jsx', 'Cart.jsx', 'CartItem.jsx', 'CartContext.jsx', 'cart-service.js'],
  },
  {
    id: 2,
    nim: '24.11.5940',
    name: 'Muhammad Irfan Amelianso',
    role: 'UI/UX Designer',
    avatar: '🧑🏽‍💻',
    color: '#ec4899',
    jobdesk: 'Kategori Pakaian Muslim, Profile, Login & Register',
    bio: 'Irfan bertanggung jawab atas seluruh aspek visual dan kenyamanan pengguna. Ia memiliki visi untuk menciptakan antarmuka yang minimalis namun terasa premium.',
    files: ['Login.jsx', 'Register.jsx', 'Profile.jsx', 'AuthContext.jsx', 'auth-service.js', 'muslimClothingProducts.js'],
  },
  {
    id: 3,
    nim: '24.11.5950',
    name: 'Andika Cavllo B',
    role: 'Frontend Developer',
    avatar: '👨🏼‍💻',
    color: '#10b981',
    jobdesk: 'Halaman Favorit, Riwayat Transaksi, Kategori Hoodie',
    bio: 'Andika adalah ahli dalam mengubah desain menjadi kode yang interaktif. Ia memastikan setiap animasi berjalan mulus di segala perangkat.',
    files: ['Favorites.jsx', 'Orders.jsx', 'WishlistContext.jsx', 'wishlist-service.js', 'Category.jsx (Bagian Hoodie)'],
  },
  {
    id: 4,
    nim: '24.11.5936',
    name: 'Muhammad Farrukh al ghifari',
    role: 'Backend Developer',
    avatar: '👨🏾‍💻',
    color: '#f59e0b',
    jobdesk: 'Kategori Celana, About Us, Kategori Topi',
    bio: 'Farrukh mengelola segala sesuatu di balik layar, mulai dari sistem keamanan hingga manajemen data transaksi pengguna.',
    files: ['About.jsx', 'ProductCard.jsx', 'Category.jsx (Bagian Celana & Topi)'],
  },
  {
    id: 5,
    nim: '24.11.5926',
    name: 'Ahmad Nur Malik',
    role: 'Quality Assurance',
    avatar: '👨🏽‍💻',
    color: '#ef4444',
    jobdesk: 'Kategori Kaos, Checkout, Halaman Workshirt',
    bio: 'Ahmad memastikan website ini bebas dari bug. Dengan ketelitian tinggi, ia menguji setiap fitur sebelum sampai ke tangan pengguna.',
    files: ['Checkout.jsx', 'Invoice.jsx', 'Category.jsx (Bagian Kaos)'],
  },
];

const sharedFiles = ['Home.jsx', 'Products.jsx', 'ProductGrid.jsx', 'style.css', 'App.css'];

function About() {
  const [activeId, setActiveId] = useState(null);
  const activeMember = teamMembers.find((m) => m.id === activeId);

  return (
    <main id="about-page">
      {/* ── Hero ── */}
      <div
        className="relative rounded-2xl overflow-hidden mb-10 text-center py-16 px-6"
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, #2d2d6e 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, var(--accent) 0%, transparent 45%), radial-gradient(circle at 80% 30%, #818cf8 0%, transparent 40%)',
          }}
        />
        <div className="relative z-10">
          <span className="text-5xl block mb-4">👥</span>
          <h1 className="text-3xl font-extrabold text-white mb-2" style={{ letterSpacing: '0.05em' }}>
            Tim Pengembang
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem' }}>MIST.CO — Final Project Pemrograman Web · AMIKOM Yogyakarta</p>
        </div>
      </div>

      {/* ── Team Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {teamMembers.map((member, i) => (
          <button
            key={member.id}
            id={`team-card-${member.id}`}
            onClick={() => setActiveId(activeId === member.id ? null : member.id)}
            className="card text-left p-6 transition-all animate-fade-in-up"
            style={{
              animationDelay: `${i * 0.07}s`,
              border: activeId === member.id ? `2px solid ${member.color}` : '2px solid var(--border)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = member.color)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = activeId === member.id ? member.color : 'var(--border)')}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{
                  background: `${member.color}20`,
                  border: `2px solid ${member.color}40`,
                }}
              >
                {member.avatar}
              </div>
              <div>
                <p className="font-extrabold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {member.name}
                </p>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-bold mt-1 inline-block"
                  style={{
                    background: `${member.color}20`,
                    color: member.color,
                  }}
                >
                  {member.role}
                </span>
              </div>
            </div>

            {/* NIM & Jobdesk */}
            <div className="rounded-xl p-3 mb-4 text-xs space-y-1" style={{ background: 'var(--surface-2)' }}>
              <div className="flex gap-2">
                <span style={{ color: 'var(--text-muted)' }}>NIM</span>
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  {member.nim}
                </span>
              </div>
              <div className="flex gap-2">
                <span style={{ color: 'var(--text-muted)' }}>Jobdesk</span>
                <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {member.jobdesk}
                </span>
              </div>
            </div>

            {/* File List */}
            <div className="flex flex-wrap gap-1.5">
              {member.files.map((f) => (
                <span
                  key={f}
                  className="text-xs px-2 py-0.5 rounded-full font-mono font-semibold"
                  style={{
                    background: `${member.color}15`,
                    color: member.color,
                    border: `1px solid ${member.color}30`,
                  }}
                >
                  ✅ {f}
                </span>
              ))}
            </div>

            {/* Expand hint */}
            <p className="text-xs mt-4 font-semibold" style={{ color: member.color, opacity: 0.8 }}>
              {activeId === member.id ? '▲ Tutup detail' : '▼ Lihat bio'}
            </p>
          </button>
        ))}
      </div>

      {/* ── Detail Bio (expanded) ── */}
      {activeMember && (
        <div className="card p-8 mb-10 animate-fade-in" style={{ border: `2px solid ${activeMember.color}` }}>
          <div className="flex items-center gap-5 mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{
                background: `${activeMember.color}20`,
                border: `2px solid ${activeMember.color}40`,
              }}
            >
              {activeMember.avatar}
            </div>
            <div>
              <h2 className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
                {activeMember.name}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {activeMember.nim} · {activeMember.role}
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
            {activeMember.bio}
          </p>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
              File yang Dikerjakan
            </p>
            <div className="flex flex-wrap gap-2">
              {activeMember.files.map((f) => (
                <span
                  key={f}
                  className="text-xs px-3 py-1 rounded-full font-mono font-semibold"
                  style={{
                    background: `${activeMember.color}15`,
                    color: activeMember.color,
                    border: `1px solid ${activeMember.color}30`,
                  }}
                >
                  ✅ {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Shared Files ── */}
      <div className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🤝</span>
          <div>
            <h2 className="text-lg font-extrabold" style={{ color: 'var(--text-primary)' }}>
              File Shared
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Dikerjakan bersama oleh seluruh tim
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {sharedFiles.map((f) => (
            <span
              key={f}
              className="text-xs px-3 py-1.5 rounded-full font-mono font-semibold"
              style={{
                background: 'rgba(99,102,241,0.12)',
                color: '#818cf8',
                border: '1px solid rgba(99,102,241,0.25)',
              }}
            >
              ✅ {f}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}

export default About;
