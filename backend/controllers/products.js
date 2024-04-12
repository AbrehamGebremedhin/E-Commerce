const path = require('path')
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Product = require('../models/Product');

exports.getProducts = asyncHandler(async (req, res, next) => { 
    res.status(200).json(res.advancedResults);
});

exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorResponse(`Product not found using ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: product
    });
});

exports.addProduct = asyncHandler(async (req, res, next) => {
    // if( req.user.role !== 'admin' ){
    //     return next(new ErrorResponse(`Cannot create more than one bootcamp`, 400));
    // }

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        data: product
    });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!product) {
        return next(new ErrorResponse(`Product not found using ${req.params.id}`, 404));
    }

    if (req.user.role !== 'admin'){
        return next(new ErrorResponse(`You are not allowed to edit this product`, 403));
    }

    res.status(200).json({
        success: true,
        data: product
    });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorResponse(`Product not found using ${req.params.id}`, 404));
    }
    
    if (req.user.role !== 'admin'){
        return next(new ErrorResponse(`You are not allowed to delete this product`, 403));
    }

    product.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});


exports.productPhotoUpload = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorResponse(`Product not found using ${req.params.id}`, 404));
    }
    
    if(!req.files){
        return next(new ErrorResponse('Please upload a file', 400));
    }

    const file = req.files.file;

    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse('Please upload an appropriate image file', 400));
    }

    if(file.size > process.env.MAX_FILE_UPLOAD){
        return next(new ErrorResponse(`Please upload an image file less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

    file.name = `photo_${product._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.log(err); 
            return next(new ErrorResponse('Error while upload', 500));
        }

        await Product.findByIdAndUpdate(req.params.id, {
            Image: file.name
        });

        res.status(200).json({
            success: true,
            data: file.name
        });
    })
});
