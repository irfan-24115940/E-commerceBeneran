const { getDb } = require('../utils/db');
const { success } = require('../utils/response');

async function getDashboardStats(req, res, next) {
  try {
    const db = getDb(req);

    const [usersResult, productsResult, ordersResult, revenueResult] = await Promise.all([
      db.query('SELECT COUNT(*) as total FROM users'),
      db.query('SELECT COUNT(*) as total FROM products'),
      db.query('SELECT COUNT(*) as total FROM orders'),
      db.query('SELECT SUM(grand_total) as total FROM orders WHERE status = $1', ['paid']) // Assuming 'paid' status for revenue, adjust if it's different.
    ]);

    const stats = {
      totalUsers: parseInt(usersResult.rows[0].total) || 0,
      totalProducts: parseInt(productsResult.rows[0].total) || 0,
      totalOrders: parseInt(ordersResult.rows[0].total) || 0,
      revenue: parseFloat(revenueResult.rows[0].total) || 0,
    };

    return success(res, 'Dashboard stats fetched successfully', { stats });
  } catch (e) {
    return next(e);
  }
}

module.exports = { getDashboardStats };
