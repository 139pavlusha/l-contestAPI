const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cokieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const colors = require('colors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to DB
connectDB();

// Route files
const auth = require('./routes/auth');
const submission = require('./routes/submissions');

const app = express();

// Body parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Dev logging Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    // app.use(logger) - my custom middleware logger
}

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// File uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS scrypting attacks
app.use(xss());

// rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/submission', submission);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`.yellow.bold)
);

// Handle unhandeled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});