const express = require('express');
const {
    getCart,
    createCart,
    updateCart,
    deleteCart
} = require('../controllers/carts')

const router = express.Router();

const Cart = require('../models/Cart');

const { protect } = require('../middleware/auth');

router.use(protect);

router
    .route('/')
    .post(createCart);

router
    .route('/:id')
    .get(getCart)
    .patch(updateCart)
    .delete(deleteCart);

module.exports = router;