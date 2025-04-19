const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true},
    hashPassword: { type: String, required: true},
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    isAdmin: { type: Boolean, default: false },
})

const Users = mongoose.model('Users', userSchema);
module.exports = Users;

