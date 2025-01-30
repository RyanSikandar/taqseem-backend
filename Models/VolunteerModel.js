const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const volunteerSchema = new Schema({
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
  cause: {
    type: String,
    required: true
  },
  help: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  currentVolunteers: {
    type: Number,
    required: true,
    default: 0
  },
  targetVolunteers: {
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
  isCompleted: {
    type: Boolean,
    default: false
  },
});

const Donation = mongoose.model("Volunteer", volunteerSchema);

module.exports = Donation;