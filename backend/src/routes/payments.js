const express = require('express');
const router = express.Router();

const { authRequired } = require('../middleware/auth');
const paymentsController = require('../controllers/paymentsController');

router.get('/', authRequired, paymentsController.list);
router.post('/verify', authRequired, paymentsController.verify);

module.exports = router;

