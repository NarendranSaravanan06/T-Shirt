const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Check if the error is a custom error with status code
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message: message,
        // Only add stack trace in development
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
