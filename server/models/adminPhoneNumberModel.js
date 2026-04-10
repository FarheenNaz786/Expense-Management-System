const mongoose = require("mongoose");

const adminPhoneNumberSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    adminId: {
      type: String,
      required: true,
      ref: "admins",
    },
  },
  { timestamps: true }
);

// This model used for admin's phone verification through sending OTP on phone.
const AdminPhoneNumberModel = mongoose.model(
  "adminphonenumbers",
  adminPhoneNumberSchema
);

module.exports = AdminPhoneNumberModel;
