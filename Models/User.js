const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
});

const User = mongoose.model('User', userSchema);

module.exports = User;
