const express = require('express');
const {
    getProduct, 
    getProducts,
    addProduct,
    updateProduct, 
    deleteProduct, 
    productPhotoUpload
} = require('../controllers/products')

const router = express.Router();

const Product = require('../models/Product');

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.route('/:id/photo').put(protect, authorize('admin'), productPhotoUpload); 

router
    .route('/')
    .get(advancedResults(Product), getProducts)
    .post(protect, authorize('admin'), addProduct);

router
    .route('/:id')
    .get(protect, authorize('admin'), getProduct)
    .patch(protect, authorize('admin'), updateProduct)
    .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;