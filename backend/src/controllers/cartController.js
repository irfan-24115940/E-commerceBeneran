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

async function ensureCart(db, userId) {
  const created = await db.query(
    'INSERT INTO carts (user_id) VALUES ($1) ON CONFLICT (user_id) DO UPDATE SET user_id = EXCLUDED.user_id RETURNING id',
    [userId]
  );
  return created.rows[0].id;
}

async function getCart(req, res, next) {
  try {
    const db = getDb(req);
    const userId = req.auth.userId;

    const cartIdRow = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    const cartId = cartIdRow.rows[0]?.id;
    if (!cartId) return success(res, 'Cart fetched', { cart: { items: [] } });

    const rows = await db.query(
      `SELECT
        ci.product_id,
        ci.quantity,
        p.id, p.title, p.description, c.key AS category_key, p.image, p.price,
        p.rating, p.reviews, p.badge, p.stock
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      JOIN categories c ON c.id = p.category_id
      WHERE ci.cart_id = $1
      ORDER BY ci.created_at DESC`,
      [cartId]
    );

    const items = rows.rows.map(r => ({ ...mapProductFallback(r), quantity: Number(r.quantity) }));
    return success(res, 'Cart fetched', { cart: { items } });
  } catch (e) {
    return next(e);
  }
}

async function addItem(req, res, next) {
  try {
    const db = getDb(req);
    const userId = req.auth.userId;
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

async function updateItem(req, res, next) {
  try {
    const db = getDb(req);
    const userId = req.auth.userId;
    const productId = Number(req.params.productId);
    const { quantity } = req.body;

    const cartIdRow = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    const cartId = cartIdRow.rows[0]?.id;
    if (!cartId) return success(res, 'Cart updated', { ok: true });

    await db.query(
      'UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3',
      [Number(quantity), cartId, productId]
    );

    return success(res, 'Item updated', { ok: true });
  } catch (e) {
    return next(e);
  }
}

async function removeItem(req, res, next) {
  try {
    const db = getDb(req);
    const userId = req.auth.userId;
    const productId = Number(req.params.productId);

    const cartIdRow = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    const cartId = cartIdRow.rows[0]?.id;
    if (!cartId) return success(res, 'Item removed', { ok: true });

    await db.query('DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2', [cartId, productId]);
    return success(res, 'Item removed', { ok: true });
  } catch (e) {
    return next(e);
  }
}

async function clearCart(req, res, next) {
  try {
    const db = getDb(req);
    const userId = req.auth.userId;

    const cartIdRow = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    const cartId = cartIdRow.rows[0]?.id;
    if (!cartId) return success(res, 'Cart cleared', { ok: true });

    await db.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
    return success(res, 'Cart cleared', { ok: true });
  } catch (e) {
    return next(e);
  }
}

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };

