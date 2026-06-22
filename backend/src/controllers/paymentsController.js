const { getDb } = require('../utils/db');
const { success } = require('../utils/response');

async function list(req, res, next) {
  try {
    const db = getDb(req);
    const userId = req.auth.userId;

    const result = await db.query(
      `SELECT p.id, p.order_id, p.provider, p.status, p.amount, p.paid_at, p.created_at
       FROM payments p
       JOIN orders o ON o.id = p.order_id
       WHERE o.user_id = $1
       ORDER BY p.created_at DESC`,
      [userId]
    );

    return success(res, 'Payments fetched', { payments: result.rows });
  } catch (e) {
    return next(e);
  }
}

async function verify(req, res, next) {
  try {
    const db = getDb(req);
    const userId = req.auth.userId;
    const { orderId, status } = req.body;

    const allowed = ['pending','paid','failed'];
    const nextStatus = allowed.includes(status) ? status : 'pending';

    await db.query(
      `UPDATE payments p
       SET status = $1,
           paid_at = CASE WHEN $1 = 'paid' THEN NOW() ELSE NULL END,
           updated_at = NOW()
       FROM orders o
       WHERE o.id = p.order_id AND o.user_id = $2 AND p.order_id = $3`,
      [nextStatus, userId, Number(orderId)]
    );

    return success(res, 'Payment verified', { ok: true });
  } catch (e) {
    return next(e);
  }
}

module.exports = { list, verify };

