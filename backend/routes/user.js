const express = require('express');
const { getAllUsers, getUser, registerUser, updateUser, deleteUser } = require('../controllers/users');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth')
const User = require('../models/User');

const router = express.Router();

// router.use(protect);
// router.use(authorize('admin'));

router.route('/allUsers').get(advancedResults(User), getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
router.route('/createUser').post(registerUser);


module.exports = router;