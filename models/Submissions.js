const mongoose = require('mongoose');

const SubmissionsSchema = new mongoose.Schema({
    task: {
        type: String,
        required: [true, 'Please add a letter of Task']
    },
    code: {
        type: String,
        required: [true, 'Please load the code'],
    },
    userID: {
        type: String,
        required: [true, 'No user ID']
    },
    userName: {
        type: String,
        required: [true, 'No user name']
    },
    crearedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Submissions', SubmissionsSchema);