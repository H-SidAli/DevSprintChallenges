const express = require('express');
const router = express.Router();

const authController = require('./auth.controller.js');
const { registerValidation, loginValidation } = require('./auth.validation.js')

// register a new user.
router.post('/register', authController.registerUser);

router.post('/login', authController.loginUser);

router.post('/logout', authController.logoutUser);

module.exports = router;