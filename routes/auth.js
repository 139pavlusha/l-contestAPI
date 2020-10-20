const express = require('express');
const { protect } = require('../middleware/auth');
const {
    register,
    login,
    getMe,
    updateTasks,
    getUsers,
    logout } = require('../controllers/auth');

const router = express.Router();

router.post('/register', register)
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/update', protect, updateTasks);
router.get('/users', getUsers);

module.exports = router;