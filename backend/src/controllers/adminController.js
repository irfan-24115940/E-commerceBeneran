const { getDb } = require('../utils/db');
const { success } = require('../utils/response');

async function getDashboardStats(req, res, next) {
  try {
    const db = getDb(req);

    const [usersResult, productsResult, ordersResult, revenueResult] = await Promise.all([
      db.query('SELECT COUNT(*) as total FROM users'),
      db.query('SELECT COUNT(*) as total FROM products WHERE is_active = true'),
      db.query('SELECT COUNT(*) as total FROM orders'),
      db.query(`SELECT COALESCE(SUM(grand_total), 0) as total FROM orders WHERE status IN ('paid','Completed','Shipped')`)
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

async function getReports(req, res, next) {
  try {
    const db = getDb(req);

    const [usersR, productsR, ordersR, revenueR, recentR, bestR] = await Promise.all([
      db.query('SELECT COUNT(*) as total FROM users'),
      db.query('SELECT COUNT(*) as total FROM products WHERE is_active = true'),
      db.query('SELECT COUNT(*) as total FROM orders'),
      db.query(`SELECT COALESCE(SUM(grand_total), 0) as total FROM orders WHERE status IN ('paid','Completed','Shipped')`),
      db.query(`
        SELECT o.id, o.status, o.grand_total, o.created_at,
               u.name AS customer_name, u.email AS customer_email
        FROM orders o
        LEFT JOIN users u ON u.id = o.user_id
        ORDER BY o.created_at DESC
        LIMIT 10
      `),
      db.query(`
        SELECT
          p.id, p.title, p.image,
          COALESCE(SUM(oi.quantity), 0) AS total_sold,
          COALESCE(SUM(oi.quantity * oi.price), 0) AS total_revenue
        FROM products p
        LEFT JOIN order_items oi ON oi.product_id = p.id
        GROUP BY p.id, p.title, p.image
        ORDER BY total_sold DESC
        LIMIT 10
      `)
    ]);

    return success(res, 'Reports fetched successfully', {
      totalUsers: parseInt(usersR.rows[0].total) || 0,
      totalProducts: parseInt(productsR.rows[0].total) || 0,
      totalOrders: parseInt(ordersR.rows[0].total) || 0,
      totalSales: parseFloat(revenueR.rows[0].total) || 0,
      recentOrders: recentR.rows.map(r => ({
        id: Number(r.id),
        status: r.status,
        grandTotal: Number(r.grand_total),
        createdAt: r.created_at,
        customerName: r.customer_name || 'N/A',
        customerEmail: r.customer_email || 'N/A',
      })),
      bestSellingProducts: bestR.rows.map(r => ({
        id: Number(r.id),
        title: r.title,
        image: r.image || '',
        totalSold: Number(r.total_sold),
        totalRevenue: Number(r.total_revenue),
      })),
    });
  } catch (e) {
    return next(e);
  }
}

module.exports = { getDashboardStats, getReports };
