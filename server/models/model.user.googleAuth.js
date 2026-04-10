// models/model.user.googleAuth.js
const mongoose = require("mongoose");

const googleAuthUserSchema = new mongoose.Schema(
  {
    expenseAppUserId: {
      type: String,
      required: true,
      unique: true,
    },
    googleId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
      type: String,
      default: "Prefer not to say",
    },
  },
  { timestamps: true }
);

const GoogleAuthUserModel = mongoose.model(
  "GoogleAuthUser",
  googleAuthUserSchema
);

module.exports = GoogleAuthUserModel;
