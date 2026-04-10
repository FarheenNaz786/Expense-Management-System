const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    adminKey: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values but enforces uniqueness for non-null values
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "Not Provided",
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isRequestApproved: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

const adminModel = mongoose.model("admins", adminSchema);
module.exports = adminModel;
