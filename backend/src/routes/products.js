const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

// Public routes (for customers)
router.get('/', productController.list);
router.get('/:id', productController.getById);

module.exports = router;
