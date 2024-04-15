 const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const sendEmail = require('../utils/sendemail');


//Register User
exports.addUser = asyncHandler( async(req, res, next) => {
    const { username, email, phonenumber, password, role } = req.body;
    
    const user = await User.create({
        username,
        phonenumber,
        email,
        password,
        role
    })

    sendJWT(user, 200, res);
});

//Login User
exports.loginUser = asyncHandler( async(req, res, next) => {
    const { email, password } = req.body;
    
    //Validation
    if(!email || !password) {
        return next(new ErrorResponse('Please enter an Email or password', 400))
    }

    const user = await User.findOne({ email }).select('+password');

    if(!user) {
        return next(new ErrorResponse('Invalid Email', 401));
    }

    const isCorrect = await user.matchPassword(password);

    if(!isCorrect) {
        return next(new ErrorResponse('Invalid Password', 401));
    }

    sendJWT(user, 200, res);
});

//Logout User
exports.logoutUser = asyncHandler( async(req, res, next) => {
    res.cookie('token', 'none', {
        maxAge: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        data: {}        
    })
});

//Gets logged in user information
exports.getCurrentUser = asyncHandler( async(req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user        
    })
}); 

//Sends password reset token through email
exports.forgotPassword = asyncHandler( async(req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if(!user) {
        return next(new ErrorResponse(`No Such User with this ${req.body.email}`, 404));
    }

    const resetToken = user.getResetPasswordToken();

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/reset/${resetToken}`;

    const message = `You are receiving email because you or someelse has requested for a password change. \n\n ${resetURL}`;
    
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            message
        });

        res.status(200).json({
            success: true,
            data: 'EMAIL SENT'
        })
    }catch(err){
        console.log(err);
        user.resetPasswordToken = undefined; 
        user.resetPasswordExpire = undefined; 

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse(`EMAIL not sent`, 500));
    }

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        data: user        
    })
}); 

//Changes the password
exports.resetPassword = asyncHandler( async(req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });


    if(!user) {
        return next(new ErrorResponse(`Invalid Token`, 404));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendJWT(user, 200, res);
}); 

//Update User Information
exports.updateUser = asyncHandler( async(req, res, next) => {
    const fieldsToUpdate = {
        username: req.body.username,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user        
    })
}); 

//Update User Password
exports.updateUserPassword = asyncHandler( async(req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if(!(await user.matchPassword(req.body.oldPassword))){
        return next(new ErrorResponse(`Entered Current Password not correct`, 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendJWT(user, 200, res);
}); 

const sendJWT = (user, status, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7
    }

    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    res
       .status(status)
       .cookie('token', token, options)
       .json({
            success: true,
            token
       })
}

