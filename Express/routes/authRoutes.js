const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isLoggedin } = require('../middleware/authMiddleware');

router.get('/login', authController.renderLogin);
router.post('/login', authController.login);
router.get('/logout', isLoggedin, authController.logout);

module.exports = router;
