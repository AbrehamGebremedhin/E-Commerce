const express = require('express');
const {
    getInventories,
    getInventory,
    addInventory,
    updateInventory,
    deleteInventory
} = require('../controllers/inventories')

const router = express.Router();

const Inventory = require('../models/Inventory');

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router
    .route('/')
    .get(advancedResults(Inventory), getInventories)
    .post(addInventory);

router
    .route('/:id')
    .get(getInventory)
    .patch(updateInventory)
    .delete(deleteInventory);

module.exports = router;