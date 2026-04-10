const express = require("express");
const {
  requestAdminAccess,
  adminLogin,
  getDashboardData,
  getAdminProfile,
  updateAdminPhone,
  sendOTPForAdminPhoneVerification,
  verifyAdminPhoneOTP,
  deactivateAdminAccount,
} = require("../controllers/adminController");

//router object
const router = express.Router();

//routes
// POST: Request Admin Access
router.post("/request-access", requestAdminAccess);

// POST: Admin Login
router.post("/login", adminLogin);

// POST: Get Dashboard Data
router.post("/dashboard", getDashboardData);

// POST: Get Admin Profile
router.post("/profile", getAdminProfile);

// PUT: Update Admin Phone Number (Legacy - without OTP)
router.put("/update-phone", updateAdminPhone);

// POST: Send OTP for Admin Phone Verification
router.post("/send-phone-otp", sendOTPForAdminPhoneVerification);

// POST: Verify Admin Phone OTP and Update Profile
router.post("/verify-phone-otp", verifyAdminPhoneOTP);

// PUT: Deactivate Admin Account
router.put("/deactivate", deactivateAdminAccount);

module.exports = router;
