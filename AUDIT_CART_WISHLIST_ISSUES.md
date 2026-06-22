# AUDIT REPORT: Cart & Wishlist Issues

**Date**: 2026-06-16  
**Status**: COMPLETE DIAGNOSIS  
**Severity**: CRITICAL - Data tidak muncul setelah Add To Cart/Wishlist

---

## EXECUTIVE SUMMARY

✅ Frontend event listeners BEKERJA (tombol memanggil fungsi)  
✅ API requests TERKIRIM ke backend  
✅ Backend routes TERDAFTAR dengan benar  
✅ Backend controllers MENERIMA dan menyimpan ke database  
✅ Database queries BERHASIL dieksekusi  

❌ **MASALAH UTAMA**: Cart & Wishlist tidak di-refresh setelah login  
❌ Token localStorage tidak konsisten antara modules  
❌ Contexts tidak mendengarkan perubahan auth state  

---

## 1. ALUR DATA: TEKNIS AUDIT

### Frontend Flow:
```
ProductCard.jsx (onClick handler)
    ↓
useCart().addToCart(product)  ← CartContext
    ↓
apiAddToCart(product, 1)  ← cart-service.js
    ↓
fetch('POST /cart/items', headers)
    ↓
Backend menerima dan INSERT ke database ✅
    ↓
Frontend memperbarui state secara optimistic ✅ TAPI...
    ↓
Masalah: Ketika user baru login, getCart() TIDAK DIPANGGIL ULANG ❌
```

---

## 2. ROOT CAUSE ANALYSIS

### ❌ MASALAH #1: CartContext useEffect hanya berjalan SEKALI

**File**: [frontend/src/context/CartContext.jsx](frontend/src/context/CartContext.jsx#L29-L36)
```jsx
useEffect(() => {
  let isMounted = true;
  getCart().then(items => {
    if (isMounted) setCartItems(items);
  });
  getTransactions().then(userOrders => {
    if (isMounted) setOrders(userOrders);
  });
  return () => { isMounted = false; };
}, []);  // ⚠️ EMPTY ARRAY = RUNS ONLY ONCE ON MOUNT
```

**Waktu Eksekusi:**
1. User membuka app (tanpa login) → CartContext mount → `getCart()` dipanggil
2. Token auth header = kosong → return []
3. `cartItems = []` ✅
4. User login → token tersimpan di localStorage
5. **TAPI** useEffect TIDAK dipanggil ulang karena dependency array kosong
6. `cartItems` tetap [] ❌

**Expected Behavior**:
- Ketika token berubah, useEffect harus dipanggil lagi
- Atau ketika `authUpdated` event terkirim, CartContext harus re-fetch

---

### ❌ MASALAH #2: WishlistContext Sama Masalahnya

**File**: [frontend/src/context/WishlistContext.jsx](frontend/src/context/WishlistContext.jsx#L23-L30)
```jsx
useEffect(() => {
  let isMounted = true;
  getWishlist().then(items => {
    if (isMounted) setWishlist(items);
  });
  return () => { isMounted = false; };
}, []);  // ⚠️ EMPTY ARRAY = RUNS ONLY ONCE
```

**Masalah Identik**: Tidak re-fetch setelah login.

---

### ❌ MASALAH #3: Token localStorage Tidak Konsisten

**Auth Context** [frontend/src/context/AuthContext.jsx](frontend/src/context/AuthContext.jsx#L14-L17):
```jsx
const [token, setToken] = useState(() => localStorage.getItem('mist_token') || null);
```
Menyimpan ke: `localStorage.setItem('mist_token', token)`

**Cart Service** [frontend/src/services/cart-service.js](frontend/src/services/cart-service.js#L7-L13):
```jsx
const getAuthHeaders = () => {
  const userStr = localStorage.getItem('mist_user');  // ⚠️ 'mist_user'
  if (userStr) {
    const user = JSON.parse(userStr);
    return {
      'Authorization': `Bearer ${user.token}`  // ⚠️ Ambil dari 'mist_user'
    };
  }
};
```

**Wishlist Service** sama masalahnya.

**Analisis**:
- AuthContext menyimpan token di `'mist_token'`
- Cart/Wishlist service mencari token di `'mist_user'.token`
- Jika `'mist_user'` kosong → Authorization header kosong
- Backend menerima request tanpa token → 401 Unauthorized ❌

---

### ❌ MASALAH #4: No Event Listeners untuk Auth Changes

**Dalam AuthContext** [frontend/src/context/AuthContext.jsx](frontend/src/context/AuthContext.jsx#L61):
```jsx
window.dispatchEvent(new Event('authUpdated'));  // Event dikirim setelah login
```

**Dalam CartContext** [frontend/src/context/CartContext.jsx](frontend/src/context/CartContext.jsx#L29):
```jsx
useEffect(() => {
  // ⚠️ Tidak ada listener untuk 'authUpdated'
  // ⚠️ Dependency array kosong
  // Result: Tidak pernah re-fetch setelah login
}, []);
```

**Expected**: CartContext harus mendengarkan event 'authUpdated' dan re-fetch.

---

### ❌ MASALAH #5: API Response Bisa Gagal Tanpa Error Check

**Cart Service** [frontend/src/services/cart-service.js](frontend/src/services/cart-service.js#L41-L51):
```javascript
export const addToCart = async (product, quantity = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers: getAuthHeaders(),  // Bisa kosong token!
      body: JSON.stringify({ productId: product.id, quantity })
    });

    const data = await response.json();
    if (response.ok && data.success) {
      console.log('Cart Item Added');
      return true;
    }
    return false;  // ⚠️ Silent fail, tidak log error
  } catch (error) {
    console.error("Add cart error:", error);
    return false;  // ⚠️ Silent fail
  }
};
```

**Masalah**:
- Jika token kosong → 401 response
- Function return `false`
- Frontend hanya melakukan optimistic update
- Tidak ada warning ke user bahwa request gagal ❌

---

## 3. EVIDENCE FROM CODE

### Event Button Clicks: ✅ OK
**File**: [frontend/src/components/ProductCard.jsx](frontend/src/components/ProductCard.jsx#L66-L80)
```jsx
<button
  id={`add-cart-btn-${product.id}`}
  onClick={handleAddToCart}  // ✅ Event terdaftar
>
```

Event listener ada dan bekerja.

---

### Service Functions: ✅ Tersedia
**File**: [frontend/src/services/cart-service.js](frontend/src/services/cart-service.js)
```javascript
export const getCart = async () => { /* ... */ };
export const addToCart = async (product, quantity = 1) => { /* ... */ };
export const updateQuantity = async (productId, newQuantity) => { /* ... */ };
export const removeFromCart = async (productId) => { /* ... */ };
export const clearCart = async () => { /* ... */ };
```

Semua fungsi tersedia. ✅

---

### Backend Routes: ✅ Registered
**File**: [backend/src/server.js](backend/src/server.js#L34):
```javascript
app.use('/cart', cartRoutes);
app.use('/wishlist', wishlistRoutes);
```

Routes terdaftar. ✅

**File**: [backend/src/routes/cart.js](backend/src/routes/cart.js):
```javascript
router.get('/', authRequired, cartController.getCart);      // ✅
router.post('/items', authRequired, cartController.addItem); // ✅
router.patch('/items/:productId', authRequired, cartController.updateItem); // ✅
router.delete('/items/:productId', authRequired, cartController.removeItem); // ✅
router.delete('/', authRequired, cartController.clearCart); // ✅
```

Semua endpoints ada. ✅

---

### Backend Controllers: ✅ Logic OK
**File**: [backend/src/controllers/cartController.js](backend/src/controllers/cartController.js#L17-L30)
```javascript
async function addItem(req, res, next) {
  try {
    const db = getDb(req);
    const userId = req.auth.userId;  // ✅ Dari JWT token
    const { productId, quantity } = req.body;

    const cartId = await ensureCart(db, userId);
    
    await db.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES ($1,$2,COALESCE($3,1))
       ON CONFLICT (cart_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
      [cartId, Number(productId), Number(quantity || 1)]
    );

    return success(res, 'Item added', { ok: true });
  } catch (e) {
    return next(e);
  }
}
```

Logic INSERT benar. ✅

---

### Database Schema: ✅ Tables OK
**File**: [backend/src/db/schema.sql](backend/src/db/schema.sql)
```sql
CREATE TABLE IF NOT EXISTS carts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
  ...
);

CREATE TABLE IF NOT EXISTS cart_items (
  id BIGSERIAL PRIMARY KEY,
  cart_id BIGINT NOT NULL REFERENCES carts(id),
  product_id BIGINT NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  ...
  UNIQUE (cart_id, product_id)
);
```

Schema benar. ✅

---

## 4. MASALAH YANG DITEMUKAN

| No | Masalah | File | Severity | Root Cause |
|----|---------|------|----------|-----------|
| 1 | Cart tidak muncul setelah login | CartContext.jsx:29-36 | CRITICAL | useEffect dependency array kosong, tidak re-fetch |
| 2 | Wishlist tidak muncul setelah login | WishlistContext.jsx:23-30 | CRITICAL | useEffect dependency array kosong, tidak re-fetch |
| 3 | Token localStorage tidak konsisten | AuthContext.jsx vs cart-service.js | HIGH | AuthContext menyimpan di 'mist_token', cart-service baca dari 'mist_user' |
| 4 | No listener untuk auth changes | CartContext.jsx + WishlistContext.jsx | HIGH | Tidak mendengarkan window event 'authUpdated' |
| 5 | Silent API failures | cart-service.js:41-51 | MEDIUM | Tidak ada error notification ke user |
| 6 | Optimistic update bisa salah | CartContext.jsx:44-54 | MEDIUM | Jika API gagal, state sudah berubah |

---

## 5. SCENARIO TESTING

### Scenario A: User Login → Add to Cart ❌
```
1. User buka app
   - CartContext useEffect runs → getCart() dengan empty token → []
   
2. User login
   - Token disimpan ke localStorage['mist_token']
   - AuthContext dispatch 'authUpdated'
   - CartContext TIDAK MENDENGARKAN → tidak re-fetch

3. User klik "Add to Cart"
   - handleAddToCart() dipanggil
   - apiAddToCart() fetch ke /cart/items
   - getAuthHeaders() baca dari localStorage['mist_user'] → KOSONG
   - Authorization header kosong
   - Backend return 401 Unauthorized
   - return false
   - Frontend sudah optimistic update tapi API gagal ❌
   - Data tidak masuk database ❌
   - Toast belum check response success
   
4. User buka Cart page
   - useCart() state = [product] (dari optimistic update)
   - Tapi server data = [] (INSERT gagal)
   - Jika page di-refresh, cart kosong ❌
```

### Scenario B: Correct Flow (After Fix) ✅
```
1. User buka app
   - CartContext useEffect runs → getCart() → []

2. User login
   - Token disimpan
   - AuthContext dispatch 'authUpdated'
   - CartContext LISTENS → re-fetch getCart()
   - getCart() baca token dengan benar → []

3. User klik "Add to Cart"
   - apiAddToCart() dengan valid token
   - Backend INSERT berhasil
   - return true
   - Frontend update state
   - Data ada di database ✅
   - Refresh page → data still there ✅

4. User buka Cart page
   - cartItems = [product dari database] ✅
```

---

## 6. PENYEBAB SEBENARNYA

### Penyebab #1: Cart & Wishlist tidak re-fetch setelah login
**File**: CartContext.jsx:29-36, WishlistContext.jsx:23-30  
**Root Cause**: `useEffect(..., [])` - dependency array kosong  
**Impact**: Cart tetap kosong setelah user login  

### Penyebab #2: Token tidak bisa diakses dari cart/wishlist service
**File**: cart-service.js:7-13, wishlist-service.js:7-13  
**Root Cause**: `localStorage.getItem('mist_user')` tapi AuthContext menyimpan ke `'mist_token'`  
**Impact**: Authorization header kosong → 401 Unauthorized → API gagal  

### Penyebab #3: Konteks tidak pernah di-trigger ulang setelah perubahan auth
**File**: CartContext.jsx, WishlistContext.jsx  
**Root Cause**: Tidak ada listener untuk window event 'authUpdated'  
**Impact**: Data stale ketika user login/logout  

---

## 7. KESIMPULAN

**Mengapa Add To Cart tidak muncul di halaman Cart:**

1. ✅ Tombol klik bekerja
2. ✅ API request terkirim
3. ✅ Backend menerima (jika token valid)
4. ❌ **Token TIDAK VALID** karena localStorage key mismatch
5. ❌ API return 401 → INSERT gagal
6. ❌ Frontend hanya optimistic update → data tampil sementara
7. ❌ Refresh page → data hilang (tidak ada di database)

**Mengapa data tidak tersimpan ke database:**
- Token tidak terkirim → 401 Unauthorized
- Controller tidak bisa ambil userId dari token
- INSERT tidak dieksekusi

**Mengapa data tidak muncul di Cart page:**
- CartContext tidak pernah di-refresh setelah login
- useEffect hanya berjalan sekali (saat app mount sebelum login)
- Ketika user login, CartContext tetap punya data lama (empty array)

---

## RECOMMENDED FIXES

1. **Sinkronisasi localStorage key** untuk token
2. **Tambah event listener** di CartContext & WishlistContext untuk 'authUpdated'
3. **Re-fetch cart/wishlist** setelah login
4. **Tambah error handling** untuk API failures
5. **Batalkan optimistic update** jika API gagal

**Priority**: Fix #1, #2, dan #3 dulu (Critical Impact)

---

## Next Steps

Lanjut ke IMPLEMENTATION PHASE untuk fix semua issues.
