const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');


// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Create User
    const user = await User.create({
        name,
        email,
        password
    });

    sendTokenResponse(user, 200, res);
});


// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});


// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({ success: true, data: user });
});


// @desc    Update user's tasks
// @route   PUT /api/v1/auth/update
// @access  Private
exports.updateTasks = asyncHandler(async (req, res, next) => {
    const userModel = await User.findById(req.user);
    
    if (!userModel.isAdmin) {
        console.log(user);
        return next(new ErrorResponse('Only admin can access this route', 401));
    }

    const user = await User.findByIdAndUpdate(req.user.id, req.body);
    res.status(200).json({ success: true, data: user });
});


// @desc    Get users
// @route   PUT /api/v1/auth/users
// @access  Public
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();
    let data = [];
    users.forEach(el => {
        data.push({
            name: el.name,
            tasks: el.tasks
        });
    });;
    res.status(200).json({ success: true, data });
});


// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({ success: true, data: {} });
});


// Get token from model, create cookies and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });
}