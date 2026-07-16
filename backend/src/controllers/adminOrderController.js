const { getDb } = require('../utils/db');
const { success } = require('../utils/response');

const VALID_STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

async function listAll(req, res, next) {
  try {
    const db = getDb(req);

    const result = await db.query(`
      SELECT
        o.id, o.status, o.created_at AS "createdAt",
        o.full_name, o.email, o.phone,
        o.payment_method, o.total, o.shipping, o.tax, o.grand_total,
        u.name AS customer_name, u.email AS customer_email_user
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC
    `);

    const orders = result.rows.map(o => ({
      id: Number(o.id),
      status: o.status,
      createdAt: o.createdAt,
      customerName: o.customer_name || o.full_name || 'N/A',
      customerEmail: o.customer_email_user || o.email || 'N/A',
      phone: o.phone || '',
      paymentMethod: o.payment_method,
      total: Number(o.total),
      shipping: Number(o.shipping),
      tax: Number(o.tax),
      grandTotal: Number(o.grand_total),
    }));

    return success(res, 'All orders fetched', { orders });
  } catch (e) {
    return next(e);
  }
}

async function updateStatus(req, res, next) {
  try {
    const db = getDb(req);
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(422).json({
        success: false,
        message: `Invalid status. Allowed: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const result = await db.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, status',
      [status, id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    return success(res, 'Order status updated', {
      order: { id: Number(result.rows[0].id), status: result.rows[0].status },
    });
  } catch (e) {
    return next(e);
  }
}

module.exports = { listAll, updateStatus };
