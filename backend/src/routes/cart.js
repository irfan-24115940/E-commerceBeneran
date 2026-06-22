const express = require('express');
const router = express.Router();

const { authRequired } = require('../middleware/auth');
const cartController = require('../controllers/cartController');

router.get('/', authRequired, cartController.getCart);
router.post('/items', authRequired, cartController.addItem);
router.patch('/items/:productId', authRequired, cartController.updateItem);
router.delete('/items/:productId', authRequired, cartController.removeItem);
router.delete('/', authRequired, cartController.clearCart);

module.exports = router;

