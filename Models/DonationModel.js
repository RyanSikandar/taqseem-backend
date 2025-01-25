const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donationSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: [String],
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  currentAmount: {
    type: Number,
    required: true,
    default: 0
  },
  targetAmount: {
    type: Number,
    required: true
  },
  daysLeft: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  IBAN: {
    type: String,
    required: true
  },
  BankName: {
    type: String,
    required: true
  },
  AccountTitle: {
    type: String,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
});

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;