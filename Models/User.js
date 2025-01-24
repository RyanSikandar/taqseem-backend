const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    image: {
        type: String
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    cnic: {
        type: Number,
        required: [true, 'CNIC is required'],
        unique: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
