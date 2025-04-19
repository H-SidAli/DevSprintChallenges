const { body } = require("express-validator");

const registerValidation = [
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];

const loginValidation = [
    body("email")
        .isEmail()
        .withMessage("Please enter a valid email"),
    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];