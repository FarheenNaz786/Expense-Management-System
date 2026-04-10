const mongoose = require("mongoose");

const userOTPSchema = new mongoose.Schema(
  {
    expenseAppUserId: {
      type: String,
      required: true,
      ref: "users",
    },
    otp: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: null,
    },
    emailType: {
      type: String,
      enum: ["primary", "secondary"],
      default: "primary",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600,
    },
  },
  { timestamps: true }
);

// This model used for user's email verification through sending OTP on email.
const UserOTPModel = mongoose.model("userotps", userOTPSchema);

module.exports = UserOTPModel;
