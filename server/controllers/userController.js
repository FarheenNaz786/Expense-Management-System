const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const CLIENT_URL = require("../utils/baseURL");
const resetPasswordEmail = require("../utils/emailTemplates/resetPasswordEmail");
const resetPasswordSuccess = require("../utils/emailTemplates/resetPasswordSuccess");
const changedPasswordSuccess = require("../utils/emailTemplates/changedPasswordSuccess");
const UserPhoneNumberModel = require("../models/userPhoneNumberModel");

const { customAlphabet } = require("nanoid");
const sendMailThroughBrevo = require("../services/brevoEmailService");
const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const JWT_SECRET_KEY = "expense-management-system-secret-key";
const JWT_EXPIRE_IN = "60m";
const BCRYPT_SALT_ROUNDS = 10;
const EMAIL_FROM_ADDRESS = "no-reply@expense-management-system.com";

const sendSmsMock = async (phoneNumber, otp) => {
  console.log(`Mock SMS to ${phoneNumber}: OTP=${otp}`);
  return { status: "sms-mocked" };
};

const createToken = (expenseAppUserId) => {
  return jwt.sign({ expenseAppUserId }, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRE_IN,
  });
};

//Register Callback: Login not required
const registerController = async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  try {
    // Ckeck for any field should not be empty
    if (!name || !email || !password) {
      console.log("All fields are required!");
      return res.status(400).json({
        Status: "failed",
        message: "All fields are required...!",
      });
    }

    // Validate the email that email entered is in correct email format
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ Status: "failed", message: "Email must be a valid email..." });
    }

    // For strong password
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        Status: "failed",
        message:
          "Password must be a strong password which includes capital letters, small letters and numbers...!",
      });
    }

    // Check that that user with this email already exist or not
    const user = await userModel.findOne({ email: email });
    if (user) {
      return res.status(400).json({
        status: "failed",
        message: "User already exists...",
      });
    }

    // Creating a hashCode for password and keep this hashcode in database
    // instead of actual password
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    const passwordHashingCode = await bcrypt.hash(password, salt);

    // Generate a Nano ID for user
    const nanoid = customAlphabet(alphabet, 10); // 10 is the length of the Nano ID
    const nanoId = nanoid();

    // Now create and save the user in database
    const newUser = new userModel({
      expenseAppUserId: nanoId,
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      password: passwordHashingCode,
      isVerified: true,
    });

    await newUser.save();

    // For jwt token
    const jwt_token = createToken(newUser.expenseAppUserId);
    
    return res.status(200).json({
      success: true,
      registeredWith: "EMAIL", // Flag to identify email/password users
      newUser: {
        expenseAppUserId: newUser.expenseAppUserId,
        name: newUser.name,
        token: jwt_token,
        isVerified: newUser.isVerified,
      },
      Status: "Success",
      message: "Successfully Registered...!",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: "Unable to register...!",
    });
  }
};

// Login Callback: Login not required
const loginControllerThroughEmail = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Ckeck that any field not be empty
    if (!email || !password) {
      return res.status(400).json({
        Status: "failed",
        message: "All fields are required...!",
      });
    }

    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ Status: "failed", message: "Invalid email or password...!" });
    }

    // Validate user password
    const validatePassword = await bcrypt.compare(password, user.password);
    if (user.email !== email || !validatePassword) {
      return res.status(400).json({
        Status: "failed",
        message: "Invalid email or Password...!",
      });
    }

    // Now start the JWT process here
    const jwt_token = createToken(user.expenseAppUserId);

    return res.status(200).json({
      success: true,
      registeredWith: "EMAIL", // Flag to identify email/password users
      user: {
        expenseAppUserId: user.expenseAppUserId,
        name: user.name,
        token: jwt_token,
        isVerified: user.isVerified,
      },
      Status: "Success",
      message: "Successfully LoggedIn...!",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: "Unable to login. Please try again..!",
    });
  }
};

// Controller for fetching details of Logged User: Login required
const loggedUser = async (req, res) => {
  const user = req.user;

  res.send({
    user: {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber ?? "Not Provided",
      isPhoneVerified: user.isPhoneVerified ?? false,
      address: user.address ?? "Not Provided",
      favouriteSport: user.favouriteSport ?? "Not Provided",
      birthDate: user.birthDate ?? "",
      gender: user.gender ?? "Prefer not to say",
      isVerified: user.isVerified ?? false,
      secondaryEmail: user.secondaryEmail ?? null,
      isSecondaryEmailVerified: user.isSecondaryEmailVerified ?? false,
      createdAt: user.createdAt,
    },
  });
};


// Controller for user profile update: Login required
const updateUserProfile = async (req, res) => {
  const { name, email, phoneNumber, address, birthDate, favouriteSport, gender } =
    req.body;

  console.log("Req body: ", req.body);
  try {
    if (
      !name ||
      !email ||
      !phoneNumber ||
      !address ||
      !birthDate ||
      !favouriteSport ||
      !gender
    ) {
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required...!" });
    }

    const user = await userModel.findOne({ expenseAppUserId: req.user.expenseAppUserId });

    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "User doesn't exist or Unauthorized user...!",
      });
    }

    const updateData = {
      name: name,
      email: email,
      address: address,
      birthDate: String(birthDate),
      favouriteSport: favouriteSport,
      gender: gender,
    };

    // Only update phoneNumber if it's different, and preserve isPhoneVerified status
    if (String(phoneNumber) !== user.phoneNumber) {
      updateData.phoneNumber = String(phoneNumber);
      // If phone number is changed, reset verification status (will be set to true after OTP verification)
      updateData.isPhoneVerified = false;
    } else {
      // Keep existing phone number and verification status
      updateData.phoneNumber = user.phoneNumber;
      // Don't update isPhoneVerified if phone number hasn't changed
    }

    await userModel.findOneAndUpdate(
      { expenseAppUserId: req.user.expenseAppUserId },
      { $set: updateData }
    );

    return res.status(200).json({
      status: "success",
      message: "User profile updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: "Something went wrong in updating user profile...!",
    });
  }
};

// Reset User Password : Login required
// MiddlwWare: checkUserAuth is used here
// This is for if user is logged in then he can reset his password
const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  try {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required...!" });
    }

    // BTW No need of this validation because user is already logged in
    if (!req.user) {
      return res.status(400).json({
        status: "failed",
        message: "Unauthorize user...!",
      });
    }

    // Validate user password first
    const user = await userModel.findOne({
      expenseAppUserId: req.user.expenseAppUserId,
    });
    
    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "User not found...!",
      });
    }

    const validatePassword = await bcrypt.compare(oldPassword, user.password);
    if (!validatePassword) {
      return res.status(400).json({
        Status: "failed",
        message: "Incorrect old password...!",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: "failed",
        message: "Password and confirm password mismatched...!",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        status: "failed",
        message: "Old Password and New Password should not be same...!",
      });
    }

    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    const newHashPassword = await bcrypt.hash(newPassword, salt);

    const result = await userModel.findOneAndUpdate(
      { expenseAppUserId: req.user.expenseAppUserId },
      {
        $set: { password: newHashPassword },
      }
    );

    // Send the mail to user that his password has been changed successfully.
    try {
      info = await sendMailThroughBrevo({
        to: user.email,
        subject: "Congratulation! Your password has been changed successfully",
        html: changedPasswordSuccess(user, EMAIL_FROM_ADDRESS) // Your HTML generator
      });
    } catch (error) {
      console.error("Password changed success mail failed to send...! Error:", error);
      return res.status(400).json({
        status: "failed",
        message: "Password changed success mail failed to send...!",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User password changed successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: "Something went wrong in reset user password...!",
    });
  }
};

// Send User Password Reset Email: Login not required
const sendUserPasswordResetEmail = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res
        .status(400)
        .json({ status: "failed", message: "Email field required...!" });
    }

    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ status: "failed", message: "User doesn't exist...!" });
    }
    const secrete = user.expenseAppUserId + JWT_SECRET_KEY;
    const token = jwt.sign(
      { expenseAppUserId: user.expenseAppUserId },
      secrete,
      {
        expiresIn: "60m",
      }
    );

    const reset_password_link = `${CLIENT_URL}/reset-password/${user.expenseAppUserId}/${token}`;

    // Now Send Email
    try {
      info = await sendMailThroughBrevo({
        to: user.email,
        subject: "Reset your Expense Management System account password",
        html: resetPasswordEmail(user,reset_password_link, EMAIL_FROM_ADDRESS) // Your HTML generator
      });
    } catch (error) {
      console.error("Password reset mail failed to send...! Error:", error);
      return res.status(400).json({
        status: "failed",
        message: "Password reset mail failed to send...!",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Password Reset Email Sent. Please Check Your Email...!",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: "Something went wrong in sending user password reset email...!",
    });
  }
};

const resetUserPasswordThroughForgotPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { expenseAppUserId, token } = req.params; // by params we get things which is in links
  try {
    if (!password || !confirmPassword) {
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required...!" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "failed",
        message: "Password and confirm password mismatched...!",
      });
    }

    const user = await userModel.findOne({
      expenseAppUserId: expenseAppUserId,
    });

    const new_secrete = user.expenseAppUserId + JWT_SECRET_KEY;
    const payload = jwt.verify(token, new_secrete);

    if (!payload) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid or Expired Token...!",
      });
    }

    // Now hash password and update in database
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    const newHashPassword = await bcrypt.hash(password, salt);

    const result = await userModel.findOneAndUpdate(
      { expenseAppUserId: user.expenseAppUserId },
      {
        $set: { password: newHashPassword },
      }
    );

    // Send the mail to user that his password has been reset successfully.
    try {
      info = await sendMailThroughBrevo({
        to: user.email,
        subject: "Congratulations! Your password has been reset successfully",
        html: resetPasswordSuccess(user, EMAIL_FROM_ADDRESS) // Your HTML generator
      });
    } catch (error) {
      console.error("Password reset success mail failed to send...! Error:", error);
      return res.status(400).json({
        status: "failed",
        message: "Password reset success mail failed to send...!",
      });
    }
    
    return res.status(200).json({
      status: "success",
      message: "User password reset successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: "Something went wrong in reset user password...!",
    });
  }
};

// Fot OTP Verification through Mobile Number
const sendOTPForMobileVerification = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    if (!phoneNumber) {
      return res.status(400).json({
        status: "failed",
        message: "Phone number field required...!",
      });
    }

    // Generate OTP: 6 digit random number
    const OTP = Math.floor(100000 + Math.random() * 900000);

    // Now check that user with this mobile number already exist or not
    const user = await UserPhoneNumberModel.findOne({
      phoneNumber: phoneNumber,
    });

    // If user with this mobile number already exist then update the OTP in database
    // and then sent SMS for OTP verification.
    // If user is not created then create the user and save the OTP in database
    // and then sent SMS for OTP verification.
    if (user) {
      // Now send the OTP to user's mobile number
      // const info = await sendSMS(mobileNumber, OTP);
      // const response = await axios.get("https://www.fast2sms.com/dev/bulkV2", {
      //   params: {
      //     authorization: [removed FAST2SMS_API_KEY],
      //     variables_values: `${OTP}`,
      //     route: "otp",
      //     numbers: Number(phoneNumber),
      //   },
      // });

      const messageData = {
        sender_id: "FSTSMS",
        message: `Your OTP for phone number verification is ${OTP} - Expense Management System.`,
        language: "english",
        route: "q",
        numbers: phoneNumber,
      };

      await sendSmsMock(phoneNumber, OTP);
      console.log("Mock SMS sent to:", phoneNumber);

      const updatedOTP = await UserPhoneNumberModel.findByIdAndUpdate(
        user._id,
        {
          $set: { otp: String(OTP) },
        }
      );

      res.json({
        success: true,
        message:
          "OTP sent successfully. Check your phone and verify with your OTP...!",
      });
    } else {
      // Now send the OTP to user's mobile number
      // const info = await sendSMS(mobileNumber, OTP);
      // const response = await axios.get("https://www.fast2sms.com/dev/bulkV2", {
      //   params: {
      //     authorization: [removed FAST2SMS_API_KEY],
      //     variables_values: `${OTP}`,
      //     route: "otp",
      //     numbers: Number(phoneNumber),
      //   },
      // });

      const messageData = {
        sender_id: "FSTSMS",
        message: `Your OTP for phone number verification is ${OTP} - Expense Management System.`,
        language: "english",
        route: "q",
        numbers: phoneNumber,
      };

      await sendSmsMock(phoneNumber, OTP);
      console.log("Mock SMS sent to:", phoneNumber);

      // Now create model in UserMobileNumberModel for verification of mobile number and save it
      const newUserPhoneNumber = new UserPhoneNumberModel({
        phoneNumber: phoneNumber,
        otp: String(OTP),
      });
      await newUserPhoneNumber.save();

      res.json({
        success: true,
        message:
          "OTP sent successfully. Check your phone and verify with your OTP...!",
        phoneNumber: phoneNumber,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message:
        "Something went wrong in sending OTP for phone number verification...!",
    });
  }
};

// Verify Mobile Number through OTP: Login not required
const verifyMobileNumberThroughOTP = async (req, res) => {
  const { phoneNumber } = req.body;
  const { otp } = req.body;
  try {
    const user = await UserPhoneNumberModel.findOne({
      phoneNumber: phoneNumber,
    });
    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid or Expired OTP...!",
      });
    }

    if (user.otp !== String(otp)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid or Expired OTP...!",
      });
    }

    // Update the OTP in data base with null and isVerified to true.
    user.otp = "null";
    user.isVerified = true;
    await user.save();

    return res.status(200).json({
      status: "success",
      message:
        "Phone number verification through OTP has been verified successfully...!",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message:
        "Something went wrong in phone number verification through OTP...!",
    });
  }
};

// Send OTP for phone verification during profile update: Login required
const sendPhoneOTPForProfileUpdate = async (req, res) => {
  const { phoneNumber } = req.body;
  const expenseAppUserId = req.user.expenseAppUserId;

  try {
    if (!phoneNumber) {
      return res.status(400).json({
        status: "failed",
        message: "Phone number field required...!",
      });
    }

    // Generate OTP: 6 digit random number
    const OTP = Math.floor(100000 + Math.random() * 900000);

    // Send OTP via SMS
    const messageData = {
      sender_id: "FSTSMS",
      message: `Your OTP for phone number verification is ${OTP} - Expense Management System.`,
      language: "english",
      route: "q",
      numbers: phoneNumber,
    };

    await sendSmsMock(phoneNumber, OTP);
    console.log("Mock SMS sent to:", phoneNumber);

    // Check if phone number already exists in UserPhoneNumberModel
    const existingPhone = await UserPhoneNumberModel.findOne({
      phoneNumber: phoneNumber,
    });

    if (existingPhone) {
      // Update OTP
      existingPhone.otp = String(OTP);
      existingPhone.isVerified = false;
      existingPhone.expenseAppUserId = expenseAppUserId;
      await existingPhone.save();
    } else {
      // Create new entry
      const newUserPhoneNumber = new UserPhoneNumberModel({
        phoneNumber: phoneNumber,
        otp: String(OTP),
        expenseAppUserId: expenseAppUserId,
        isVerified: false,
      });
      await newUserPhoneNumber.save();
    }

    return res.status(200).json({
      status: "success",
      message: "OTP sent successfully. Check your phone and verify with your OTP...!",
      phoneNumber: phoneNumber,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "Something went wrong in sending OTP for phone number verification...!",
    });
  }
};

// Verify phone OTP and update user profile: Login required
const verifyPhoneOTPAndUpdateProfile = async (req, res) => {
  const { phoneNumber, otp } = req.body;
  const expenseAppUserId = req.user.expenseAppUserId;

  try {
    if (!phoneNumber || !otp) {
      return res.status(400).json({
        status: "failed",
        message: "Phone number and OTP are required...!",
      });
    }

    const phoneRecord = await UserPhoneNumberModel.findOne({
      phoneNumber: phoneNumber,
      expenseAppUserId: expenseAppUserId,
    });

    if (!phoneRecord) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid or Expired OTP...!",
      });
    }

    if (phoneRecord.otp !== String(otp)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid or Expired OTP...!",
      });
    }

    const user = await userModel.findOne({ expenseAppUserId: expenseAppUserId });

    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "User doesn't exist or Unauthorized user...!",
      });
    }

    // Update phone number and verification status
    await userModel.findOneAndUpdate(
      { expenseAppUserId: expenseAppUserId },
      {
        $set: {
          phoneNumber: phoneNumber,
          isPhoneVerified: true,
        },
      }
    );

    // Mark phone as verified in UserPhoneNumberModel
    phoneRecord.isVerified = true;
    phoneRecord.otp = "null";
    await phoneRecord.save();

    return res.status(200).json({
      status: "success",
      message: "Phone number verified and updated successfully...!",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      message: "Something went wrong in verifying phone number...!",
    });
  }
};

module.exports = {
  registerController,
  loginControllerThroughEmail,
  updateUserProfile,
  changePassword,
  sendUserPasswordResetEmail,
  loggedUser,
  resetUserPasswordThroughForgotPassword,
  sendOTPForMobileVerification,
  verifyMobileNumberThroughOTP,
  sendPhoneOTPForProfileUpdate,
  verifyPhoneOTPAndUpdateProfile,
};
