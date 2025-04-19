const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../users/users.model");
const authService = require("./auth.service");

async function registerUser(req, res) {
    try {
        console.log("Registering user:", req.body);
        const { email, password, firstName, lastName } = req.body;
        // Basic validation
        if (!email || !password || !firstName || !lastName) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }

        // newUser
        const newUser = await authService.registerUser(req.body);

        //success ta3 la reponse
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error during registration",
            data: `${error}`,
        });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }

        const user = await authService.loginUser(req.body);

        return res.status(201).json({
            success: true,
            message: "User logged in successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error during registration",
            data: `${error}`,
        });
    }
}

async function logoutUser(req, res) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res
            .status(400)
            .json({ success: false, message: "No token provided" });
    }

    await TokenBlacklist.create({ token });

    return res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
};
