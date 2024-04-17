const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Cart = require('../models/Cart');

exports.getCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({user: req.user.id, status: 'Active'});

    if (!cart) {
        return next(new ErrorResponse(`No active cart found`, 404));
    }

    res.status(200).json({
        success: true,
        data: cart
    });
});

exports.createCart = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id;
    const cart = await Cart.create(req.body);

    res.status(201).json({
        success: true,
        data: cart
    });
});

exports.updateCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!cart) {
        return next(new ErrorResponse(`Cart not found using ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: cart
    });
});

exports.deleteCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
        return next(new ErrorResponse(`Cart not found using ${req.params.id}`, 404));
    }
    
    await cart.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
