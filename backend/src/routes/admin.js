const express = require('express');
const { authRequired, roleAllowed } = require('../middleware/auth');

const { getDashboardStats, getReports } = require('../controllers/adminController');
const adminProducts  = require('../controllers/adminProductController');
const adminCategories = require('../controllers/adminCategoryController');
const adminOrders    = require('../controllers/adminOrderController');
const adminUsers     = require('../controllers/adminUserController');

const router = express.Router();

// All admin routes require authentication AND admin role
const adminGuard = [authRequired, roleAllowed('admin')];

// ── Dashboard ─────────────────────────────────────────────
router.get('/dashboard', adminGuard, getDashboardStats);

// ── Reports ───────────────────────────────────────────────
router.get('/reports', adminGuard, getReports);

// ── Products CRUD ─────────────────────────────────────────
router.get('/products',        adminGuard, adminProducts.list);
router.post('/products',       adminGuard, adminProducts.create);
router.put('/products/:id',    adminGuard, adminProducts.update);
router.delete('/products/:id', adminGuard, adminProducts.remove);

// ── Categories CRUD ───────────────────────────────────────
router.get('/categories',        adminGuard, adminCategories.list);
router.post('/categories',       adminGuard, adminCategories.create);
router.put('/categories/:id',    adminGuard, adminCategories.update);
router.delete('/categories/:id', adminGuard, adminCategories.remove);

// ── Orders ────────────────────────────────────────────────
router.get('/orders',              adminGuard, adminOrders.listAll);
router.put('/orders/:id/status',   adminGuard, adminOrders.updateStatus);

// ── Users ─────────────────────────────────────────────────
router.get('/users',      adminGuard, adminUsers.list);
router.put('/users/:id',  adminGuard, adminUsers.updateRole);

module.exports = router;
