const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    else if(req.cookies.token){
        token = req.cookies.token;
    }

    if(!token){
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try{ 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);

        req.user = await User.findById(decoded.id);
    }
    catch(err){
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
    next();
});

//Access Control based on user role
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`User type '${req.user.role}' not allowed to access this route`, 403));
        }

        next();
    }
}