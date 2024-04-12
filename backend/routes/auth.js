const express = require('express');
const { addUser, loginUser, logoutUser, getCurrentUser, forgotPassword, resetPassword, updateUser, updateUserPassword } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router()

router.post('/register', addUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/who', protect,  getCurrentUser);
router.put('/update', protect,  updateUser);
router.put('/updatePassword', protect,  updateUserPassword);
router.post('/reset',  forgotPassword);
router.put('/reset/:resettoken',  resetPassword);

module.exports = router;