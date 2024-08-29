const express = require('express');
const router = express.Router();

const { List, Read, Delete, Update } = require('../Controllers/user');
const { AuthMiddleware } = require('../middleware/auth');

router.get('/users', AuthMiddleware('Admin'), List);
router.get('/user/:id', AuthMiddleware(['Admin', 'User']), Read);
router.put('/user/:id', AuthMiddleware(['Admin', 'User']), Update);
router.delete('/user/:id', AuthMiddleware(['Admin', 'User']), Delete)

module.exports = router;