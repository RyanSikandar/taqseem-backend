const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contributionSchema = new Schema({
    donation: {
        type: Schema.Types.ObjectId,
        ref: 'Donation',
        required: true
    },
    donor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    donatedAt: {
        type: Date,
        default: Date.now
    }
});

const Contribution = mongoose.model("Contribution", contributionSchema);

module.exports = Contribution;