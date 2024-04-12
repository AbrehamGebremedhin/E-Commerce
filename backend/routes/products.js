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


router.route('/:id/photo').put(productPhotoUpload); 

router
    .route('/')
    .get(getProducts)
    .post(addProduct);

router
    .route('/:id')
    .get(getProduct)
    .put(updateProduct)
    .delete(deleteProduct);

module.exports = router;