const Users = require("../users/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerUser(data) {
    // check ida deja y'existi
    const existingUser = await Users.findOne({ email: data.email });
    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    // hash password
    const hashPassword = await bcrypt.hash(data.password, 10);

    // create new user
    const newUser = new Users({
        email: data.email,
        hashPassword: hashPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        isAdmin: data.isAdmin || false, // Admin wla Participant
    });

    await newUser.save();

    // Return success without sending back password hash
    return newUser;
}

async function loginUser(data) {
    // check if user exists
    const user = await Users.findOne({ email: data.email });
    if (!user) {
        throw new Error("User not found");
    }
    // check password
    const isMatch = await bcrypt.compare(data.password, user.hashPassword);
    if (!isMatch) {
        throw new Error("Invalid password");
    }
    return {
        user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin,
        }
    };
}

module.exports = {
    registerUser,
    loginUser,
};
