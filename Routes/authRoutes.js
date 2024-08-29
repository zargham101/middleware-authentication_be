const express = require('express');
const { Create, Login, Logout } = require('../Controllers/authController');
const router = express.Router();

router.post('/register', Create);
router.post('/login', Login);
router.post('/logout', Logout);

module.exports = router;