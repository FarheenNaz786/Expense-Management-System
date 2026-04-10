const express = require("express");
const {
  registerController,
  sendUserPasswordResetEmail,
  resetUserPasswordThroughForgotPassword,
  loggedUser,
  changePassword,
  sendOTPForMobileVerification,
  verifyMobileNumberThroughOTP,
  updateUserProfile,
  loginControllerThroughEmail,
  sendPhoneOTPForProfileUpdate,
  verifyPhoneOTPAndUpdateProfile,
} = require("../controllers/userController");

const checkUserAuth = require("../middleware/userAuth");

//router object
const router = express.Router();

// Public routes
// POST : REGISTER USER
router.post("/register", registerController);
// POST : LOGIN USER
router.post("/login", loginControllerThroughEmail);
// POST : Send reset password email
router.post("/send-reset-password-email", sendUserPasswordResetEmail);
// Reset password through forgot password email
router.post(
  "/reset-password/:expenseAppUserId/:token",
  resetUserPasswordThroughForgotPassword
);

// OTP Verification through mobile number
router.post("/send-phone-otp", sendOTPForMobileVerification);
// verify OTP
router.post("/verify-phone-otp", verifyMobileNumberThroughOTP);

// Protected routes
// All routes after this middleware will be protected
// Like: Access to dashboard, update user profile, change password etc
// POST : CHANGE USER PROFILE
router.post("/update-user-profile", checkUserAuth, updateUserProfile);
// POST : CHANGE PASSWORD
router.post("/change-password", checkUserAuth, changePassword);
// GET : LOGGED USER / USER PROFILE
router.get("/logged-user", checkUserAuth, loggedUser);
// POST : SEND PHONE OTP FOR PROFILE UPDATE
router.post("/send-phone-otp-profile", checkUserAuth, sendPhoneOTPForProfileUpdate);
// POST : VERIFY PHONE OTP AND UPDATE PROFILE
router.post("/verify-phone-otp-profile", checkUserAuth, verifyPhoneOTPAndUpdateProfile);
// Export the router
module.exports = router;
