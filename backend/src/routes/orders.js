const express = require('express');
const router = express.Router();

const { authRequired } = require('../middleware/auth');
const ordersController = require('../controllers/ordersController');

router.get('/', authRequired, ordersController.list);
router.post('/', authRequired, ordersController.create);

module.exports = router;

