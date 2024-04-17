const express = require('express');
const {
    getItems,
    addItem,
    updateItem,
    removeItem
} = require('../controllers/items')

const router = express.Router();

const Item = require('../models/Item');

const advancedResults = require('../middleware/advancedResults');
const { protect,  } = require('../middleware/auth');

router.use(protect);

router
    .route('/')
    .get(advancedResults(Item, {
        path: 'product',
        select: 'Type'
    }), getItems)
    .post(addItem);

router
    .route('/:id')
    .patch(updateItem)
    .delete(removeItem);

module.exports = router;