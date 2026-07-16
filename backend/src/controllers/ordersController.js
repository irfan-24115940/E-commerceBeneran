const { getDb } = require('../utils/db');
const { success } = require('../utils/response');

async function list(req, res, next) {
  try {
    const db = getDb(req);
    const userId = req.auth.userId;

    const orders = await db.query(
      `SELECT
        o.id, o.status, o.created_at AS "createdAt",
        o.full_name, o.email, o.phone, o.address, o.province, o.postal_code,
        o.payment_method, o.total, o.shipping, o.tax, o.grand_total
      FROM orders o
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC`,
      [userId]
    );

    const orderRows = orders.rows.map(o => ({
      id: Number(o.id),
      status: o.status,
      createdAt: o.createdAt,
      customer: {
        fullName: o.full_name,
        email: o.email,
        phone: o.phone,
        address: o.address,
        province: o.province,
        postalCode: o.postal_code,
      },
      paymentMethod: o.payment_method,
      total: Number(o.total),
      shipping: Number(o.shipping),
      tax: Number(o.tax),
      grandTotal: Number(o.grand_total),
      items: [],
    }));

    if (!orderRows.length) return success(res, 'Orders fetched', { orders: [] });

    const ids = orderRows.map(o => o.id);
    const items = await db.query(
      `SELECT
        oi.order_id,
        oi.id,
        oi.product_id,
        oi.title,
        oi.price,
        oi.quantity,
        oi.image,
        oi.category
      FROM order_items oi
      WHERE oi.order_id = ANY($1::bigint[])
      ORDER BY oi.id ASC`,
      [ids]
    );

    const byOrder = new Map();
    for (const it of items.rows) {
      const oid = Number(it.order_id);
      if (!byOrder.has(oid)) byOrder.set(oid, []);
      byOrder.get(oid).push({
        id: Number(it.id),
        productId: Number(it.product_id),
        title: it.title,
        image: it.image,
        category: it.category || 'uncategorized',
        price: Number(it.price),
        quantity: Number(it.quantity),
      });
    }

    orderRows.forEach(o => (o.items = byOrder.get(o.id) || []));

    return success(res, 'Orders fetched', { orders: orderRows });
  } catch (e) {
    return next(e);
  }
}

async function create(req, res, next) {
  try {
    const db = getDb(req);
    const userId = req.auth.userId;

    const {
      customer,
      items,
      total,
      grandTotal,
      shipping,
      tax,
      paymentMethod,
    } = req.body;

    // Insert order
    const orderIns = await db.query(
      `INSERT INTO orders (
        user_id, status,
        full_name, email, phone, address, province, postal_code, notes,
        payment_method, total, shipping, tax, grand_total
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING id, status, created_at AS "createdAt"`,
      [
        userId,
        'Processing',
        customer.fullName,
        customer.email,
        customer.phone,
        customer.address,
        customer.province,
        customer.postalCode || null,
        customer.notes || null,
        paymentMethod,
        total,
        shipping,
        tax,
        grandTotal,
      ]
    );

    const orderId = Number(orderIns.rows[0].id);

    // Insert items snapshot
    for (const it of items || []) {
      await db.query(
        `INSERT INTO order_items (
          order_id, product_id, title, price, quantity, image, category
        ) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          orderId,
          Number(it.id),
          it.title,
          it.price,
          it.quantity,
          it.image || '',
          it.category || 'uncategorized'
        ]
      );
    }

    // Clear cart items for the user
    const cartRow = await db.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
    const cartId = cartRow.rows[0]?.id;
    if (cartId) {
      await db.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
    }

    return success(res, 'Order created', {
      order: {
        id: orderId,
        status: 'Processing',
        createdAt: orderIns.rows[0].createdAt,
      },
    });
  } catch (e) {
    return next(e);
  }
}

module.exports = { list, create };

