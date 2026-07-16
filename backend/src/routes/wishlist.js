const express = require('express');
const router = express.Router();

const { authRequired } = require('../middleware/auth');
const wishlistController = require('../controllers/wishlistController');

router.get('/', authRequired, wishlistController.getWishlist);
router.post('/items', authRequired, wishlistController.addItem);
router.delete('/items/:productId', authRequired, wishlistController.removeItem);

module.exports = router;

