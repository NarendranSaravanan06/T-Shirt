const jwt = require("jsonwebtoken");
const CustomError = require("../middlewares/customError");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1]; // Extract Bearer token
        if (!token) {
            return next(new CustomError("Unauthorized: No token provided", 401));
        }
        const decoded = jwt.verify(token, process.env.JSON_SECRETKEY);
        req.user = {
            email: decoded.email,
            role: decoded.role,
            name: decoded.name,
            userId: decoded.userId
        };

        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return next(new CustomError("Unauthorized: Invalid or expired token", 401));
    }
};

module.exports = authMiddleware;
