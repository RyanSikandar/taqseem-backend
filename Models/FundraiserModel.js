const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fundraiserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  orgId: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: [true, "Organization ID is required"],
  },
  image: {
    type: String,
  },
  isDrive: {
    type: Boolean,
    required: [true, "isDrive flag is required"],
  },
  location: {
    type: [Number],
    validate: {
      validator: function (val) {
        return (
          Array.isArray(val) &&
          val.length === 2 &&
          val.every((coord) => typeof coord === "number")
        );
      },
      message: "Location must be an array of two floats [longitude, latitude]",
    },
  },
  raisedAmount: {
    type: Number,
    required: [true, "Raised amount is required"],
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"],
    default: 0,
  },
  isOpen: {
    type: Boolean,
    required: [true, "isOpen flag is required"],
    default: true
  },
});

const Fundraiser = mongoose.model("Fundraiser", fundraiserSchema);

module.exports = Fundraiser;
