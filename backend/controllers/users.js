const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

//Get ALl Users
exports.getAllUsers = asyncHandler( async(req,res,next) => {
    res.status(200).json(res.advancedResults);
});

//Get a single user
exports.getUser = asyncHandler( async(req,res,next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorResponse(`User not found using ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: user
    })
});

//Create a new user
exports.registerUser = asyncHandler( async(req,res,next) => {
    const user = await User.create(req.body)

    res.status(201).json({
        success: true,
        data: user
    })
});

//Update a user
exports.updateUser = asyncHandler( async(req,res,next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    })
});

//Delete a user
exports.deleteUser = asyncHandler( async(req,res,next) => {
    const user = await User.findByIdAndDelete(req.params.id);

    res.status(202).json({
        success: true,
        data: {}
    })
});