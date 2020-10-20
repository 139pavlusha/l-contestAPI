const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const Submissions = require('../models/Submissions');


// @desc    Create submission
// @route   POST /api/v1/submission
// @access  Public
exports.createSubmission = asyncHandler(async (req, res, next) => {
    const { task, code } = req.body;

    // Add user information
    const userID = req.user.id;
    const user = await User.findById(userID);
    const userName = user.name;

    // Create User
    const submission = await Submissions.create({
        task,
        code,
        userID,
        userName
    });

    res.status(200).json({ success: true, data: {} });
});


// @desc    Get all submissions
// @route   GET /api/v1/auth/submission
// @access  Private
exports.getAllSubmissions = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user);
    
    if (!user.isAdmin) {
        console.log(user);
        return next(new ErrorResponse('Only admin can access this route', 401));
    }
    const submissions = await Submissions.find();
    res.status(200).json({ success: true, data: submissions });
});
