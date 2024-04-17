const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Cart = require('../models/Cart');
const Item = require('../models/Item');


exports.getItems = asyncHandler(async (req, res, next) => { 
    res.status(200).json(res.advancedResults);
});


exports.addItem = asyncHandler(async (req, res, next) => {
    const user = req.user.id;
    const cart = await Cart.findOne({user: req.user.id, status: 'Active'}).orFail(Cart.create(user));
    req.body.cart = cart.id;
    req.body.product = req.body.product;
    const item = await Item.create(req.body);

    res.status(201).json({
        success: true,
        data: item
    });
});

exports.updateItem = asyncHandler(async (req, res, next) => {
    if(req.body.quantity <= 0){
        let update = await Item.findById(req.params.id);

        await update.deleteOne();
        
        res.status(200).json({
            success: true,
            data: {}
        });
    }
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!item) {
        return next(new ErrorResponse(`Item not found using ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: item
    });
});

exports.removeItem = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id);

    if (!item) {
        return next(new ErrorResponse(`Item not found using ${req.params.id}`, 404));
    }
    
    await item.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
