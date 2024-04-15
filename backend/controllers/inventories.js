const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Inventory = require('../models/Inventory');

exports.getInventories = asyncHandler(async (req, res, next) => { 
    res.status(200).json(res.advancedResults);
});

exports.getInventory = asyncHandler(async (req, res, next) => {
    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
        return next(new ErrorResponse(`Inventory not found using ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: inventory
    });
});

exports.addInventory = asyncHandler(async (req, res, next) => {
    const inventory = await Inventory.create(req.body);

    res.status(201).json({
        success: true,
        data: inventory
    });
});

exports.updateInventory = asyncHandler(async (req, res, next) => {
    const inventory = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!inventory) {
        return next(new ErrorResponse(`Inventory not found using ${req.params.id}`, 404));
    }

    if (req.user.role !== 'admin'){
        return next(new ErrorResponse(`You are not allowed to edit this inventory`, 403));
    }

    res.status(200).json({
        success: true,
        data: inventory
    });
});

exports.deleteInventory = asyncHandler(async (req, res, next) => {
    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
        return next(new ErrorResponse(`Inventory not found using ${req.params.id}`, 404));
    }
    
    if (req.user.role !== 'admin'){
        return next(new ErrorResponse(`You are not allowed to delete this inventory`, 403));
    }

    await inventory.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});
