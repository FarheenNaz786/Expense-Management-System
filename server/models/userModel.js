const mongoose = require("mongoose");

//schema design
const userSchema = new mongoose.Schema(
  {
    expenseAppUserId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: String,
      default: "Not Provided",
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    secondaryEmail: {
      type: String,
      default: null,
    },
    isSecondaryEmailVerified: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      default: "Not Provided",
    },
    birthDate: {
      type: String,
      default: "Not Provided",
    },
    favouriteSport: {
      type: String,
      default: "Not Provided",
    },
    gender: {
      type: String, // Male or Female
      default: "Not Provided",
    },
  },
  { timestamps: true }
);

//export
const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
