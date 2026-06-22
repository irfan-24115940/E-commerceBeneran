const express = require('express');
const { authRequired } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/adminController');

const router = express.Router();

// Route is protected by authRequired
router.get('/dashboard', authRequired, getDashboardStats);

module.exports = router;
