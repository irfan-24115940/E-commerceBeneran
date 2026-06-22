const express = require('express');
const { requireFields } = require('../middleware/validate');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

const authController = require('../controllers/authController');

router.post('/register', requireFields(['name','email','password']), authController.register);
router.post('/login', requireFields(['email','password']), authController.login);
router.get('/me', authRequired, authController.getProfile);

module.exports = router;

