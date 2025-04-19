const jwt = require("jsonwebtoken");

// generate token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );
};

// verifyToken w ga3
const verifyToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = decoded;
        if (!user) {
            throw new Error("User not found");
        }

        return {
            valid: true,
            expired: false,
            user,
        };
    } catch (error) {
        return {
            valid: false,
            expired: error.message === "jwt expired",
            user: null,
        };
    }
};

// Authentication middleware
const authenticate = async (req, res, next) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                status: "fail",
                message: "You are not logged in! Please log in to get access.",
            });
        }

        const { valid, expired, user } = await verifyToken(token);

        if (!valid) {
            return res.status(401).json({
                status: "fail",
                message: expired ? "Token expired" : "Invalid token",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        logger.error(`Authentication error: ${error.message}`);
        res.status(500).json({
            status: "error",
            message: "Authentication failed",
        });
    }
};

const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: "fail",
                message: "User authentication required",
            });
        }

        // Convert boolean isAdmin to role strings for comparison
        const userRole = req.user.isAdmin ? "admin" : "user";

        if (!allowedRoles.includes(userRole)) {
            console.warn(
                `Access denied for user ${req.user.email} with role ${userRole}`
            );
            return res.status(403).json({
                status: "fail",
                message: "You do not have permission to perform this action",
            });
        }

        next();
    };
};

module.exports = { generateToken, verifyToken, authenticate, restrictTo };
