import './css/variables.css';
import './css/style.css';
import './css/animation.css';
import './css/responsive.css';

import { renderNavbar } from './components/navbar.js';
import { createProductCard } from './components/product-card.js';
import { showToast } from './components/toast.js';
import { renderProductSkeleton } from './components/loading-skeleton.js';
import { $, $$, on } from './utils/dom-helper.js';
import { addToCart, getCart, updateQuantity, removeFromCart } from './services/cart-service.js';
import { toggleWishlist, getWishlist } from './services/wishlist-service.js';
import { getProducts } from './services/product-service.js';
import { formatRupiah } from './utils/formatter.js';
import { register, login, logout, isLoggedIn, getUser } from './services/auth-service.js';
import { saveTransaction, getTransactions, generateInvoiceId } from './services/transaction-service.js';

const teamData = {
  'muhammad-dhani-favian': {
    name: 'Muhammad Dhani Favian',
    role: 'Lead Developer',
    avatar: '👨🏻‍💻',
    bio: 'Dhani adalah arsitek utama di balik MIST.CO. Dengan keahlian mendalam dalam JavaScript dan arsitektur sistem, ia memastikan performa website tetap optimal dan stabil.',
    tasks: ['Arsitektur Sistem', 'Logic Routing', 'Integrasi Database']
  },
  'muhammad-irfan-amelianso': {
    name: 'Muhammad Irfan Amelianso',
    role: 'UI/UX Designer',
    avatar: '🧑🏽‍💻',
    bio: 'Irfan bertanggung jawab atas seluruh aspek visual dan kenyamanan pengguna. Ia memiliki visi untuk menciptakan antarmuka yang minimalis namun terasa premium.',
    tasks: ['Visual Design', 'Color Systems', 'User Experience']
  },
  'andika-cavllo-b': {
    name: 'Andika Cavllo B',
    role: 'Frontend Developer',
    avatar: '👨🏼‍💻',
    bio: 'Andika adalah ahli dalam mengubah desain menjadi kode yang interaktif. Ia memastikan setiap animasi berjalan mulus di segala perangkat.',
    tasks: ['UI Components', 'Responsive Design', 'Micro-interactions']
  },
  'muhammd-farrukh-al-ghifari': {
    name: 'Muhammd Farrukh al ghifari',
    role: 'Backend Developer',
    avatar: '👨🏾‍💻',
    bio: 'Farrukh mengelola segala sesuatu di balik layar, mulai dari sistem keamanan hingga manajemen data transaksi pengguna.',
    tasks: ['Auth Systems', 'Logic Bisnis', 'Transaction Management']
  },
  'ahmad-nur-malik': {
    name: 'Ahmad nur malik',
    role: 'Quality Assurance',
    avatar: '👨🏽‍💻',
    bio: 'Ahmad memastikan website ini bebas dari bug. Dengan ketelitian tinggi, ia menguji setiap fitur sebelum sampai ke tangan pengguna.',
    tasks: ['Bug Testing', 'Code Debugging', 'Final Quality Check']
  }
};

// Setup routing sederhana berbasis hash
const routes = {
  '': renderHome,
  '#home': renderHome,
  '#products': renderProductsPage,
  '#cart': renderCart,
  '#wishlist': renderWishlist,
  '#login': renderLogin,
  '#about': renderAbout,
  '#checkout': renderCheckout,
  '#profile': renderProfile,
  '#history': renderHistory
};

async function initApp() {
  await renderNavbar();
  bindTeamEvents();

  // Listen untuk custom events
  window.addEventListener('cartUpdated', renderNavbar);
  window.addEventListener('wishlistUpdated', renderNavbar);
  window.addEventListener('authUpdated', async () => {
    await renderNavbar();
    handleRoute();
  });

  // Listen untuk perubahan URL hash
  window.addEventListener('hashchange', handleRoute);

  // Render initial route
  handleRoute();
  setupModals();
}

function handleRoute() {
  const hash = window.location.hash;
  const sections = $$('.page-section');
  sections.forEach(sec => {
    sec.classList.remove('active');
  });



  if (hash.startsWith('#team-detail/')) {
    renderTeamDetail();
    return;
  }

  if (hash.startsWith('#team-detail/')) {
    window.location.hash = '#about';
    return;
  }

  const renderFunc = routes[hash] || renderHome;
  renderFunc();
}

// ==========================
// RENDER PAGES
// ==========================

function renderHome() {
  $('#home-section').classList.add('active');
}

let currentCategory = 'all';
// Cache produk dari API agar tidak re-fetch setiap render
let cachedProducts = null;

async function loadProducts() {
  if (!cachedProducts) {
    cachedProducts = await getProducts();
  }
  return cachedProducts;
}

async function renderProductsPage() {
  $('#products-section').classList.add('active');
  const grid = $('#products-grid');
  const searchInput = ($('#search-input') ? $('#search-input').value : '').toLowerCase().trim();

  const chips = $$('.chip');
  chips.forEach(chip => {
    if (chip.dataset.value === currentCategory) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
    if (!chip.dataset.bound) {
      on(chip, 'click', () => {
        currentCategory = chip.dataset.value;
        renderProductsPage();
      });
      chip.dataset.bound = "true";
    }
  });

  grid.innerHTML = '<div class="grid grid-cols-4 gap-4">' + renderProductSkeleton(8) + '</div>';

  const allProducts = await loadProducts();

  // Filter kategori dan pencarian
  let filtered = allProducts;
  if (currentCategory !== 'all') {
    filtered = filtered.filter(p => (p.category || '').toLowerCase() === currentCategory.toLowerCase());
  }
  if (searchInput) {
    filtered = filtered.filter(p =>
      (p.title || p.name || '').toLowerCase().includes(searchInput) ||
      (p.description || '').toLowerCase().includes(searchInput) ||
      (p.category || '').toLowerCase().includes(searchInput)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="col-span-full text-center">Produk tidak ditemukan.</p>';
  } else {
    const groupedProducts = filtered.reduce((acc, product) => {
      const cat = product.category || 'lainnya';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(product);
      return acc;
    }, {});

    let html = '';
    const categoryConfig = {
      'hoodie': { name: 'Koleksi Hoodie Premium', cols: 'grid-cols-3', img: 'https://picsum.photos/1200/300?random=1' },
      'kaos': { name: 'Koleksi Kaos / T-Shirt', cols: 'grid-cols-4', img: 'https://picsum.photos/1200/300?random=2' },
      'celana': { name: 'Koleksi Celana', cols: 'grid-cols-4', img: 'https://picsum.photos/1200/300?random=3' },
      'workshirt': { name: 'Koleksi Workshirt', cols: 'grid-cols-4', img: 'https://picsum.photos/1200/300?random=4' },
      'pakaian-muslim': { name: 'Koleksi Pakaian Muslim', cols: 'grid-cols-2', img: 'https://picsum.photos/1200/300?random=5' },
      'topi': { name: 'Koleksi Topi & Aksesoris', cols: 'grid-cols-2', img: 'https://picsum.photos/1200/300?random=6' }
    };

    for (const [cat, prods] of Object.entries(groupedProducts)) {
      const config = categoryConfig[cat] || { name: cat, cols: 'grid-cols-4', img: '' };
      let bannerHtml = config.img ? `
        <div style="width: 100%; height: 150px; overflow: hidden; border-radius: var(--radius-md); margin-bottom: 1.5rem; position: relative;">
          <img src="${config.img}" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6);" alt="${config.name}">
          <h3 style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 2.5rem; margin: 0; text-transform: uppercase; letter-spacing: 0.1em; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">${config.name}</h3>
        </div>
      ` : `<h3 style="font-size: 1.5rem; border-bottom: 2px solid var(--primary-color); padding-bottom: 0.5rem; margin-bottom: 1rem; text-transform: uppercase;">${config.name}</h3>`;

      const cardsHtml = (await Promise.all(prods.map(p => createProductCard(p)))).join('');
      html += `<div style="margin-top: 3rem;">${bannerHtml}<div class="grid ${config.cols} gap-4">${cardsHtml}</div></div>`;
    }
    grid.innerHTML = html;
    bindProductEvents(grid, allProducts);
  }

  if (!window.searchEventBound) {
    on('#search-form', 'submit', (e) => { e.preventDefault(); renderProductsPage(); });
    window.searchEventBound = true;
  }
}

function bindProductEvents(container, productList) {
  // productList bisa dari parameter (API) atau fallback ke cache
  const resolveProduct = async (id) => {
    if (productList) return productList.find(p => p.id === id);
    const all = await loadProducts();
    return all.find(p => p.id === id);
  };

  const addCartBtns = container.querySelectorAll('.btn-add-cart');
  const buyNowBtns = container.querySelectorAll('.btn-buy-now');
  const wishlistBtns = container.querySelectorAll('.btn-wishlist-card');

  addCartBtns.forEach(btn => on(btn, 'click', async (e) => {
    const id = parseInt(e.currentTarget.dataset.id);
    if (!isLoggedIn()) { showToast('Silakan login terlebih dahulu!', 'error'); window.location.hash = '#login'; return; }
    const product = await resolveProduct(id);
    if (product) {
      const ok = await addToCart(product);
      if (ok) showToast(`${product.title || product.name} ditambahkan ke keranjang`);
      else showToast('Gagal menambahkan ke keranjang', 'error');
    }
  }));

  buyNowBtns.forEach(btn => on(btn, 'click', async (e) => {
    const id = parseInt(e.currentTarget.dataset.id);
    if (!isLoggedIn()) { showToast('Silakan login terlebih dahulu!', 'error'); window.location.hash = '#login'; return; }
    const product = await resolveProduct(id);
    if (product) {
      await addToCart(product);
      window.location.hash = '#cart';
    }
  }));

  wishlistBtns.forEach(btn => on(btn, 'click', async (e) => {
    const id = parseInt(e.currentTarget.dataset.id);
    if (!isLoggedIn()) { showToast('Silakan login terlebih dahulu!', 'error'); window.location.hash = '#login'; return; }
    const product = await resolveProduct(id);
    if (product) {
      const isAdded = await toggleWishlist(product);
      e.currentTarget.textContent = isAdded ? '❤️' : '🤍';
      showToast(isAdded ? 'Ditambahkan ke favorit' : 'Dihapus dari favorit');
    }
  }));
}

async function renderCart() {
  $('#cart-section').classList.add('active');
  const container = $('#cart-items');
  const totalEl = $('#cart-total');
  const cart = await getCart();

  // Add Step Indicator
  const cartSection = $('#cart-section');
  if (!cartSection.querySelector('.checkout-steps')) {
    const steps = document.createElement('div');
    steps.className = 'checkout-steps';
    steps.innerHTML = `
      <div class="step active"><span>1</span><label>Keranjang</label></div>
      <div class="step-line"></div>
      <div class="step"><span>2</span><label>Detail</label></div>
      <div class="step-line"></div>
      <div class="step"><span>3</span><label>Bayar</label></div>
    `;
    cartSection.insertBefore(steps, cartSection.firstChild.nextSibling);
  }

  const cartLayout = $('.cart-layout');
  if (cart.length === 0) {
    if (cartLayout) {
      cartLayout.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🛒</div>
          <h3>Keranjang Masih Kosong</h3>
          <p>Belum ada produk yang kamu pilih. Yuk, cari koleksi terbaik kami!</p>
          <a href="#products" class="btn" style="margin-top: 1rem;">Mulai Belanja</a>
        </div>`;
      cartLayout.style.display = 'block'; // Full width
    }
    if (totalEl) {
      totalEl.textContent = formatRupiah(0);
    }
    return;
  } else {
    if (cartLayout) {
      cartLayout.style.display = 'grid'; // Restore grid
      // Need to restore the structure if it was overwritten
      if (!cartLayout.querySelector('#cart-items')) {
        cartLayout.innerHTML = `
          <div id="cart-items" class="cart-items-container"></div>
          <div class="summary-card">
            <h3 style="margin-bottom: 1.5rem; text-transform: uppercase; font-size: 1.1rem;">Ringkasan Belanja</h3>
            <div class="flex justify-between" style="margin-bottom: 1.5rem; font-size: 1.25rem; font-weight: 800; border-top: 1px solid rgba(0,0,0,0.1); padding-top: 1.5rem;">
              <span>TOTAL</span>
              <span id="cart-total">Rp 0</span>
            </div>
            <button id="btn-to-checkout" class="btn" style="width: 100%;" onclick="window.location.hash='#checkout'">Lanjut ke Pembayaran</button>
          </div>
        `;
      }
    }
  }

  // Re-select container and total after potential innerHTML restore
  const finalContainer = $('#cart-items');
  const finalTotalEl = $('#cart-total');

  let html = '';
  let total = 0;
  cart.forEach(item => {
    total += (item.price * item.quantity);
    html += `
      <div class="cart-item-new">
        <div class="cart-item-image-wrap">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <div class="cart-item-header">
            <h4>${item.name}</h4>
            <button class="remove-cart-new" data-id="${item.id}">✕</button>
          </div>
          <div class="cart-item-footer">
            <div class="cart-item-price">${formatRupiah(item.price)}</div>
            <div class="cart-qty-wrap">
              <button class="qty-btn-new min" data-id="${item.id}">−</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn-new add" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`;
  });

  finalContainer.innerHTML = html;
  finalTotalEl.textContent = formatRupiah(total);

  // Bind Events
  $$('.qty-btn-new.min').forEach(btn => on(btn, 'click', async (e) => {
    const id = parseInt(e.target.dataset.id);
    const item = cart.find(i => i.id === id);
    if (item && item.quantity > 1) { await updateQuantity(id, item.quantity - 1); renderCart(); }
  }));
  $$('.qty-btn-new.add').forEach(btn => on(btn, 'click', async (e) => {
    const id = parseInt(e.target.dataset.id);
    const item = cart.find(i => i.id === id);
    if (item) { await updateQuantity(id, item.quantity + 1); renderCart(); }
  }));
  $$('.remove-cart-new').forEach(btn => on(btn, 'click', async (e) => {
    const id = parseInt(e.target.dataset.id);
    await removeFromCart(id);
    renderCart();
    showToast('Item berhasil dihapus');
  }));
}

async function renderWishlist() {
  $('#wishlist-section').classList.add('active');
  const grid = $('#wishlist-grid');
  const wishlist = await getWishlist();
  if (wishlist.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🖤</div>
        <h3>Belum Ada Favorit</h3>
        <p>Simpan produk yang kamu sukai di sini untuk memudahkan pencarian nanti.</p>
        <a href="#products" class="btn" style="margin-top: 1rem;">Cari Produk</a>
      </div>`;
  } else {
    const cardsHtml = (await Promise.all(wishlist.map(p => createProductCard(p)))).join('');
    grid.innerHTML = cardsHtml;
    bindProductEvents(grid, wishlist);
  }
}

function renderAbout() {
  $('#about-section').classList.add('active');
}

async function renderCheckout() {
  $('#checkout-section').classList.add('active');
  if (!isLoggedIn()) { window.location.hash = '#login'; showToast('Silakan login terlebih dahulu!'); return; }
  const cart = await getCart();
  if (cart.length === 0) { window.location.hash = '#cart'; showToast('Keranjang kosong!'); return; }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 15000;
  const tax = Math.round(subtotal * 0.01);
  const grandTotal = subtotal + shipping + tax;

  const totalDisplayEl = $('#checkout-total-display');
  if (totalDisplayEl) totalDisplayEl.textContent = formatRupiah(grandTotal);
  const subtotalEl = $('#checkout-subtotal');
  if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);
  const taxEl = $('#checkout-tax');
  if (taxEl) taxEl.textContent = formatRupiah(tax);

  const processBtn = $('#btn-process-checkout');
  if (!processBtn) return;
  const newBtn = processBtn.cloneNode(true);
  processBtn.parentNode.replaceChild(newBtn, processBtn);

  on(newBtn, 'click', async () => {
    const user = getUser();
    const name = $('#checkout-name') ? $('#checkout-name').value.trim() : (user?.name || '');
    const address = $('#checkout-address') ? $('#checkout-address').value.trim() : '';
    const phone = $('#checkout-phone') ? $('#checkout-phone').value.trim() : '-';
    const province = $('#checkout-province') ? $('#checkout-province').value.trim() : '-';
    const paymentMethod = (() => {
      const sel = document.querySelector('input[name="payment"]:checked');
      return sel ? sel.value : 'COD';
    })();

    if (!name || !address) { showToast('Harap lengkapi nama dan alamat!'); return; }
    if (!phone) { showToast('Harap isi nomor handphone!'); return; }
    if (!province) { showToast('Harap isi provinsi!'); return; }

    // Format payload sesuai yang diexpect ordersController.create
    const orderPayload = {
      customer: {
        fullName: name,
        email: user?.email || '',
        phone: phone,
        address: address,
        province: province,
        postalCode: $('#checkout-postal') ? $('#checkout-postal').value.trim() : '',
        notes: $('#checkout-notes') ? $('#checkout-notes').value.trim() : ''
      },
      items: cart.map(item => ({
        id: item.id,
        title: item.title || item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '',
        category: item.category || 'uncategorized'
      })),
      total: subtotal,
      shipping: shipping,
      tax: tax,
      grandTotal: grandTotal,
      paymentMethod: paymentMethod
    };

    newBtn.disabled = true;
    newBtn.textContent = 'Memproses...';
    const order = await saveTransaction(orderPayload);
    if (order) {
      showToast('Pembayaran Berhasil! Pesanan tersimpan.');
      cachedProducts = null; // reset cache
      window.location.hash = '#history';
    } else {
      showToast('Gagal membuat pesanan. Coba lagi.', 'error');
      newBtn.disabled = false;
      newBtn.textContent = 'Proses Pembayaran';
    }
  });
}

async function renderProfile() {
  $('#profile-section').classList.add('active');
  if (!isLoggedIn()) { window.location.hash = '#login'; return; }

  const user = getUser();
  if (user) {
    const nameEl = $('#profile-name');
    const emailEl = $('#profile-email');
    const avatarEl = $('#profile-avatar-char');
    if (nameEl) nameEl.textContent = user.name;
    if (emailEl) emailEl.textContent = user.email;
    if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();
  }

  const logoutBtn = $('#btn-profile-logout');
  if (logoutBtn) {
    const newBtn = logoutBtn.cloneNode(true);
    logoutBtn.parentNode.replaceChild(newBtn, logoutBtn);
    on(newBtn, 'click', () => { logout(); window.location.hash = '#home'; showToast('Berhasil keluar!'); });
  }

  const infoContent = $('#profile-info-content');
  if (infoContent && user) {
    const transactionCount = (await getTransactions()).length;
    infoContent.innerHTML = `
      <div class="profile-dashboard-grid">
        <div class="profile-main-card">
          <div class="card-title-row">
            <span class="card-icon">👤</span>
            <h3>Informasi Pribadi</h3>
          </div>
          <div class="profile-data-list">
            <div class="data-item">
              <span class="data-label">Nama Lengkap</span>
              <span class="data-value">${user.name}</span>
            </div>
            <div class="data-item">
              <span class="data-label">Alamat Email</span>
              <span class="data-value">${user.email}</span>
            </div>
          </div>
        </div>

        <div class="profile-stats-cards">
          <div class="stat-card gold-tier">
            <div class="stat-icon">👑</div>
            <div class="stat-info">
              <span class="stat-label">Status Keanggotaan</span>
              <span class="stat-value">DIAMOND MEMBER</span>
            </div>
          </div>
          <div class="stat-card total-orders">
            <div class="stat-icon">🛍️</div>
            <div class="stat-info">
              <span class="stat-label">Total Belanja</span>
              <span class="stat-value">${transactionCount} Pesanan</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

async function renderHistory() {
  $('#history-section').classList.add('active');
  if (!isLoggedIn()) { window.location.hash = '#login'; return; }

  const transactionList = $('#transaction-list');
  if (!transactionList) return;

  transactionList.innerHTML = '<div style="text-align:center;padding:2rem;">Memuat riwayat pesanan...</div>';
  const transactions = await getTransactions();

  if (transactions.length === 0) {
    transactionList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📜</div>
        <h3>Belum Ada Pesanan</h3>
        <p>Riwayat pesanan kamu akan muncul di sini setelah kamu melakukan pembelian.</p>
        <a href="#products" class="btn" style="margin-top: 1rem;">Mulai Belanja</a>
      </div>`;
  } else {
    // Backend mengembalikan: { id, status, createdAt, customer, paymentMethod, grandTotal, items[] }
    transactionList.innerHTML = transactions.map(t => {
      const itemsText = Array.isArray(t.items)
        ? t.items.map(i => `${i.title} x${i.quantity}`).join(', ')
        : (t.items || '-');
      const dateText = t.createdAt
        ? new Date(t.createdAt).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : '-';
      const priceText = formatRupiah(t.grandTotal || t.total || 0);
      const orderId = `#INV-${String(t.id).padStart(6, '0')}`;
      const statusClass = (t.status || 'Processing').toLowerCase();

      return `
        <div class="order-card-new" data-order-id="${t.id}">
          <div class="order-header-new">
            <span class="order-id-new">${orderId}</span>
            <span class="status-badge-new ${statusClass}">${t.status || 'Processing'}</span>
          </div>
          <div class="order-body-new">
            <div class="order-info-new"><h4>${itemsText}</h4><p>${dateText}</p></div>
            <div class="order-price-new"><span>${priceText}</span></div>
          </div>
        </div>
      `;
    }).join('');

    on(transactionList, 'click', (e) => {
      const card = e.target.closest('.order-card-new');
      if (!card) return;
      showInvoice({
        orderId: card.querySelector('.order-id-new')?.textContent || '',
        status: card.querySelector('.status-badge-new')?.textContent || '',
        items: card.querySelector('.order-info-new h4')?.textContent || '',
        date: card.querySelector('.order-info-new p')?.textContent || '',
        price: card.querySelector('.order-price-new span')?.textContent || ''
      });
    });
  }
}

function showInvoice(data) {
  const modal = $('#invoice-modal');
  const details = $('#invoice-details');
  if (!modal || !details) return;

  details.innerHTML = `
    <div class="invoice-header">
      <div class="invoice-brand">MIST.CO</div>
      <div class="invoice-id">${data.orderId}</div>
    </div>
    <div class="invoice-meta">
      <div class="meta-item"><span>Tanggal:</span><strong>${data.date}</strong></div>
      <div class="meta-item"><span>Status:</span><strong style="color: #166534;">${data.status}</strong></div>
    </div>
    <div class="invoice-items">
      <div class="invoice-row" style="font-weight: 800; border-bottom: 2px solid #eee; padding-bottom: 0.5rem; margin-bottom: 1rem;"><span>Item</span><span>Harga</span></div>
      <div class="invoice-row"><span>${data.items}</span><span>${data.price}</span></div>
    </div>
    <div class="invoice-total"><span>TOTAL</span><span>${data.price}</span></div>
  `;
  modal.style.display = 'block';
}

function renderLogin() {
  $('#login-section').classList.add('active');
  if (isLoggedIn()) { window.location.hash = '#home'; return; }

  let isRegistering = false;
  const toggleBtn = $('#auth-toggle-btn');
  on(toggleBtn, 'click', (e) => {
    e.preventDefault();
    isRegistering = !isRegistering;
    $('#auth-title').textContent = isRegistering ? 'Daftar Akun' : 'Masuk Akun';
    $('#auth-toggle-text').textContent = isRegistering ? 'Sudah punya akun?' : 'Belum punya akun?';
    toggleBtn.textContent = isRegistering ? 'Masuk di sini' : 'Daftar sekarang';
    $('#auth-submit-btn').textContent = isRegistering ? 'Sign Up' : 'Sign In';
    $('#register-name-group').style.display = isRegistering ? 'block' : 'none';
  });

  on('#login-form', 'submit', async (e) => {
    e.preventDefault();
    const email = $('#login-email').value;
    const pass = $('#login-password').value;
    const name = $('#login-name').value;
    
    console.log('Request Payload:', { email, password: '***', name: isRegistering ? name : undefined });

    if (isRegistering) {
      const result = await register(email, pass, name);
      if (result.success) { showToast('Pendaftaran berhasil!'); window.location.hash = '#home'; } else { showToast(result.message || 'Pendaftaran gagal!', 'error'); }
    } else { 
      const result = await login(email, pass);
      if (result.success) { showToast('Login berhasil!'); window.location.hash = '#home'; } else { showToast(result.message || 'Email/Password salah!', 'error'); } 
    }
  });
}

function bindTeamEvents() {
  $$('.team-card').forEach(card => on(card, 'click', () => {
    const name = card.querySelector('h4').textContent;
    const slug = name.toLowerCase().replace(/\./g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    window.location.hash = `#team-detail/${slug}`;
  }));
}

function renderTeamDetail() {
  const hash = window.location.hash;
  const slug = hash.replace('#team-detail/', '');
  const member = teamData[slug];

  const section = $('#team-detail-section');
  if (!section) {
    window.location.hash = '#about';
    return;
  }

  section.classList.add('active');
  const container = $('#team-detail-content');
  if (!container) return;

  if (!member) {
    window.location.hash = '#about';
    return;
  }

  const fileTags = member.files.map(function (f) {
    return '<span class="file-tag">\u2705 ' + f + '</span>';
  }).join('');

  container.innerHTML =
    '<div class="detail-header-nav">' +
    '<a href="#about" class="btn-back-link">\u2190 Kembali ke Tim</a>' +
    '</div>' +
    '<div class="profile-dashboard-grid">' +
    '<div class="profile-hero-card">' +
    '<div class="profile-hero-banner" style="background: linear-gradient(135deg, #0f172a 0%, #334155 100%);"></div>' +
    '<div class="profile-hero-body">' +
    '<div class="profile-avatar-wrap">' +
    '<div class="avatar-circle" style="font-size: 3rem; background: #fff;">' + member.avatar + '</div>' +
    '</div>' +
    '<h2>' + member.name + '</h2>' +
    '<p style="color:#94a3b8; font-size:0.85rem; margin-bottom:0.25rem;">' + member.nim + '</p>' +
    '<p>' + member.role + '</p>' +
    '<span class="member-badge">' + member.name.split(' ')[0].toUpperCase() + ' TEAM</span>' +
    '</div>' +
    '</div>' +
    '<div class="profile-main-card">' +
    '<div class="card-title-row">' +
    '<span class="card-icon">\ud83d\udcbc</span>' +
    '<h3>Jobdesk</h3>' +
    '</div>' +
    '<p style="padding: 0.5rem 1.5rem 1.5rem; color: #475569; font-size: 0.95rem; font-weight: 600;">' + member.jobdesk + '</p>' +
    '<div class="card-title-row" style="border-top: 1px solid #f1f5f9; padding-top: 2rem; margin-top: 1rem;">' +
    '<span class="card-icon">\ud83d\uddc2\ufe0f</span>' +
    '<h3>File yang Dikerjakan</h3>' +
    '</div>' +
    '<div class="team-tasks-list" style="padding: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">' +
    fileTags +
    '</div>' +
    '</div>' +
    '</div>';
}


function setupModals() {
  const modal = $('#invoice-modal');
  const teamModal = $('#team-modal');
  on('.close-modal', 'click', () => modal.style.display = 'none');
  on('.close-team-modal', 'click', () => teamModal.style.display = 'none');
  window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; if (e.target == teamModal) teamModal.style.display = 'none'; }
}



document.addEventListener('DOMContentLoaded', initApp);
