import { getCart } from '../services/cart-service.js';
import { getWishlist } from '../services/wishlist-service.js';
import { isLoggedIn, getUser, logout } from '../services/auth-service.js';
import { $, $$, on } from '../utils/dom-helper.js';

export const renderNavbar = async () => {
  const cart = await getCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlist = await getWishlist();
  const wishlistCount = wishlist.length;
  const user = getUser();
  
  const authLink = isLoggedIn() 
    ? `<a href="#profile" class="nav-icon user-nav" title="Profile">
         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
         <span>${user.name}</span>
       </a>
       <a href="#" id="logout-btn" class="nav-icon logout-nav" title="Logout">
         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
         <span>KELUAR</span>
       </a>`
    : `<a href="#login" class="nav-icon" title="Login">
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
         <span>MASUK</span>
       </a>`;

  const navbarHtml = `
    <div class="container flex justify-between items-center">
      <div class="nav-left">
        <button id="mobile-menu-btn" class="mobile-menu-btn" aria-label="Toggle Menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <a href="#home" class="nav-brand">MIST.CO</a>
      </div>
      
      <ul class="nav-links">
        <li><a href="#home">Koleksi</a></li>
        <li><a href="#products">Produk</a></li>
        <li><a href="#about">Tentang Kami</a></li>
      </ul>
      
      <div class="nav-icons">
        <a href="#wishlist" class="nav-icon" title="Favorit">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          ${wishlistCount > 0 ? `<span class="badge">${wishlistCount}</span>` : ''}
        </a>
        <a href="#history" class="nav-icon hide-mobile" title="Riwayat Pesanan">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4l3 3"></path><circle cx="12" cy="12" r="9"></circle></svg>
        </a>
        <a href="#cart" class="nav-icon" title="Keranjang">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          ${cartCount > 0 ? `<span class="badge">${cartCount}</span>` : ''}
        </a>
        <div class="nav-divider"></div>
        <div class="nav-auth-group">
          ${authLink}
        </div>
      </div>
    </div>
  `;
  
  const header = $('header');
  if (header) {
    header.innerHTML = navbarHtml;
    header.className = 'navbar';
    
    // Bind logout event
    const logoutBtn = $('#logout-btn');
    if (logoutBtn) {
      on(logoutBtn, 'click', (e) => {
        e.preventDefault();
        logout();
        window.location.hash = '#home';
      });
    }

    // Bind Mobile Menu Toggle
    const mobileBtn = $('#mobile-menu-btn');
    const navLinks = $('.nav-links');
    if (mobileBtn && navLinks) {
      on(mobileBtn, 'click', () => {
        navLinks.classList.toggle('active');
      });
      // Close menu when link is clicked
      $$('.nav-links a').forEach(link => {
        on(link, 'click', () => navLinks.classList.remove('active'));
      });
    }
  }
};
