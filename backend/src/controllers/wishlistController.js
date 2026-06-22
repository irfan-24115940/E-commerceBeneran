const { getDb } = require('../utils/db');
const { success } = require('../utils/response');

function mapProductFallback(row) {
  return {
    id: Number(row.id),
    title: String(row.title),
    description: String(row.description || ''),
    category: String(row.category_key || 'uncategorized'),
    image: String(row.image || ''),
    price: Number(row.price || 0),
    rating: Number(row.rating ?? 0),
    reviews: Number(row.reviews ?? 0),
    badge: String(row.badge ?? ''),
    stock: Number(row.stock ?? 0),
  };
}

async function ensureWishlist(db, userId) {
  const created = await db.query(
    'INSERT INTO wishlist (user_id) VALUES ($1) ON CONFLICT (user_id) DO UPDATE SET user_id = EXCLUDED.user_id RETURNING id',
    [userId]
  );
  return created.rows[0].id;
}

async function getWishlist(req, res, next) {
  try {
    const db = getDb(req);
    const userId = req.auth.userId;

    const wRow = await db.query('SELECT id FROM wishlist WHERE user_id = $1', [userId]);
    const wishlistId = wRow.rows[0]?.id;
    if (!wishlistId) return success(res, 'Wishlist fetched', { wishlist: { items: [] } });

    const rows = await db.query(
      `SELECT
        wi.product_id,
        p.id, p.title, p.description, c.key AS category_key, p.image, p.price,
        p.rating, p.reviews, p.badge, p.stock
      FROM wishlist_items wi
      JOIN products p ON p.id = wi.product_id
      JOIN categories c ON c.id = p.category_id
      WHERE wi.wishlist_id = $1
      ORDER BY wi.created_at DESC`,
      [wishlistId]
    );

    const items = rows.rows.map(mapProductFallback);
    return success(res, 'Wishlist fetched', { wishlist: { items } });
  } catch (e) {
    return next(e);
  }
}

async function addItem(req, res, next) {
  try {
    const db = getDb(req);
    const userId = req.auth.userId;
    const { productId } = req.body;

    const wishlistId = await ensureWishlist(db, userId);

    await db.query(
      'INSERT INTO wishlist_items (wishlist_id, product_id) VALUES ($1,$2) ON CONFLICT (wishlist_id, product_id) DO NOTHING',
      [wishlistId, Number(productId)]
    );

    return success(res, 'Wishlist updated', { ok: true });
  } catch (e) {
    return next(e);
  }
}

async function removeItem(req, res, next) {
  try {
    const db = getDb(req);
    const userId = req.auth.userId;
    const productId = Number(req.params.productId);

    const wRow = await db.query('SELECT id FROM wishlist WHERE user_id = $1', [userId]);
    const wishlistId = wRow.rows[0]?.id;
    if (!wishlistId) return success(res, 'Wishlist updated', { ok: true });

    await db.query('DELETE FROM wishlist_items WHERE wishlist_id = $1 AND product_id = $2', [wishlistId, productId]);
    return success(res, 'Wishlist updated', { ok: true });
  } catch (e) {
    return next(e);
  }
}

module.exports = { getWishlist, addItem, removeItem };

