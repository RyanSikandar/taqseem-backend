const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    location: {
        type: [Number],
        validate: {
            validator: function (val) {
                return Array.isArray(val) && val.length === 2 && val.every(coord => typeof coord === 'number');
            },
            message: 'Location must be an array of two floats [longitude, latitude]'
        },
        required: function () {
            return this.isOrganization === true;
        }
    },
    phoneNo: {
        type: String,
        required: [true, 'Phone number is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    isOrganization: {
        type: Boolean,
        required: [true, 'isOrganization flag is required']
    },
    isValidated: {
        type: Boolean,
        default: false,
        required: function () {
            return this.isOrganization === true;
        }
    },
    image: {
        type: String,
        default: "",
        required: function () {
            return this.isOrganization === true;
        }
    }
});

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
