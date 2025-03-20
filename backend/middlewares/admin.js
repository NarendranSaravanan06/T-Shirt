const CustomError = require('../middlewares/customError');

const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return next(new CustomError('Access denied: Admins only', 403));
    }
    next();
};

module.exports = adminMiddleware;