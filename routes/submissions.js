const express = require('express');
const { protect } = require('../middleware/auth');
const {
    createSubmission,
    getAllSubmissions } = require('../controllers/submissions');

const router = express.Router();

router
    .post('/', protect, createSubmission)
    .get('/', protect, getAllSubmissions);

module.exports = router;