const adminModel = require("../models/adminModel");
const userModel = require("../models/userModel");
const transectionModel = require("../models/transectionModel");
const AdminPhoneNumberModel = require("../models/adminPhoneNumberModel");
const validator = require("validator");
const { customAlphabet } = require("nanoid");
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const adminKeyEmail = require("../utils/emailTemplates/adminKeyEmail");
const sendMailThroughBrevo = require("../services/brevoEmailService");

const sendSmsMock = async (phoneNumber, otp) => {
  console.log(`Mock SMS to ${phoneNumber}: OTP=${otp}`);
  return { status: "sms-mocked" };
};

// Request Admin Access
const requestAdminAccess = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        status: "failed",
        message: "Name and email are required!",
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide a valid email address!",
      });
    }

    // Check if admin already exists
    const existingAdmin = await adminModel.findOne({ email: email.toLowerCase().trim() });
    if (existingAdmin) {
      return res.status(400).json({
        status: "failed",
        message: "Admin access request already exists for this email. Please wait for approval or contact support if you already have an admin key.",
      });
    }

    // Get allowed admin emails from .env
    const allowedEmails = process.env.ALLOWED_ADMIN_EMAILS
      ? process.env.ALLOWED_ADMIN_EMAILS.split(",").map((email) => email.trim().toLowerCase())
      : [];
    const emailLower = email.toLowerCase().trim();

    // Generate unique adminId for all requests
    let adminId;
    let isAdminIdUnique = false;
    let adminIdAttempts = 0;
    const maxAdminIdAttempts = 10;

    while (!isAdminIdUnique && adminIdAttempts < maxAdminIdAttempts) {
      const nanoid = customAlphabet(alphabet, 10);
      adminId = nanoid();
      const existingAdminId = await adminModel.findOne({ adminId });
      if (!existingAdminId) {
        isAdminIdUnique = true;
      }
      adminIdAttempts++;
    }

    if (!isAdminIdUnique) {
      return res.status(500).json({
        status: "failed",
        message: "Failed to generate unique admin ID. Please try again.",
      });
    }

    // Check if email is in the allowed list
    const isEmailAllowed = allowedEmails.includes(emailLower);

      if (isEmailAllowed) {
      // Email is in allowed list - Generate admin key and approve
      // Generate 16-character uppercase alphanumeric admin key
      const uppercaseAlphanumeric = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let adminKey;
      let isKeyUnique = false;
      let keyAttempts = 0;
      const maxKeyAttempts = 10;

      while (!isKeyUnique && keyAttempts < maxKeyAttempts) {
        const nanoid = customAlphabet(uppercaseAlphanumeric, 16);
        adminKey = nanoid();
        const existingKey = await adminModel.findOne({ adminKey });
        if (!existingKey) {
          isKeyUnique = true;
        }
        keyAttempts++;
      }

      if (!isKeyUnique) {
        return res.status(500).json({
          status: "failed",
          message: "Failed to generate unique admin key. Please try again.",
        });
      }

      // Create admin record with approved status
      const newAdmin = new adminModel({
        adminId: adminId,
        email: emailLower,
        adminKey: adminKey,
        name: name,
        phone: phone || "Not Provided",
        isRequestApproved: true,
      });

      await newAdmin.save();

      // Send email with admin key
      try {
        const emailHtml = adminKeyEmail(newAdmin.name, adminKey, "no-reply@expense-management-system.com");
        
        // Try using Resend
        try {
          info = await sendMailThroughBrevo({
            to: emailLower,
            subject: "Admin Access Key - Expense Management System",
            html: emailHtml,
          });
        } catch (error) {
          console.error("Email sending for admin security key failed. error:", error);
          return res.status(400).json({
            status: "failed",
            message: "Email sending for admin security key failed....!",
          });
        }
        return res.status(200).json({
          status: "success",
          message: "Admin access approved! A security key has been sent to your email address.",
        });
      } catch (emailError) {
        console.error("Email sending error:", emailError);
        // Still return success as admin is created, but log the error
        return res.status(200).json({
          status: "success",
          message: "Admin access approved! However, there was an issue sending the email. Please contact support.",
          adminKey: adminKey, // Include key in response for development/testing
        });
      }
    } else {
      // Email not in allowed list - Save request but don't send key
      const newAdmin = new adminModel({
        adminId: adminId,
        email: emailLower,
        name: name,
        phone: phone || "Not Provided",
        isRequestApproved: false,
        // adminKey will be null/undefined for unapproved requests
      });

      await newAdmin.save();

      return res.status(200).json({
        status: "success",
        message: "Thank you for your request. Our team has received it and will contact you via email shortly.",
      });
    }
  } catch (error) {
    console.error("Request admin access error:", error);
    return res.status(500).json({
      status: "failed",
      message: "Failed to process admin access request.",
      error: error.message,
    });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, adminKey } = req.body;

    // Validate required fields
    if (!email || !adminKey) {
      return res.status(400).json({
        status: "failed",
        message: "Email and admin key are required!",
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide a valid email address!",
      });
    }

    // Validate admin key format (16 uppercase alphanumeric characters)
    if (!/^[A-Z0-9]{16}$/.test(adminKey)) {
      return res.status(400).json({
        status: "failed",
        message: "Admin key must be exactly 16 uppercase alphanumeric characters!",
      });
    }

    // Find admin by email and key (without checking isActive first)
    const admin = await adminModel.findOne({
      email: email.toLowerCase().trim(),
      adminKey: adminKey,
      isRequestApproved: true, // Only allow login if request is approved
    });

    if (!admin) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid email or admin key, or your request has not been approved yet!",
      });
    }

    // Check if account is deactivated
    if (!admin.isActive) {
      return res.status(403).json({
        status: "failed",
        message: "Your account is deactivated. Please mail us with your registered email id to activate your admin account and get a new security key.",
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Return admin data (excluding sensitive info like adminKey)
    return res.status(200).json({
      status: "success",
      message: "Admin login successful!",
      admin: {
        adminId: admin.adminId,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      status: "failed",
      message: "Failed to process admin login.",
      error: error.message,
    });
  }
};

// Get Dashboard Data
const getDashboardData = async (req, res) => {
  try {
    const { adminId } = req.body;

    // Validate admin ID
    if (!adminId) {
      return res.status(400).json({
        status: "failed",
        message: "Admin ID is required!",
      });
    }

    // Verify admin
    const admin = await adminModel.findOne({
      adminId: adminId,
      isActive: true,
      isRequestApproved: true, // Only allow approved admins to access dashboard
    });

    if (!admin) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid or inactive admin ID, or your request has not been approved yet!",
      });
    }

    const emailUsers = await userModel.find({}).sort({ createdAt: -1 });

    // Get all transactions
    const transactions = await transectionModel.find({});

    // Aggregate transaction data per user
    const userTransactionMap = {};
    transactions.forEach((transaction) => {
      const userId = transaction.expenseAppUserId;
      if (!userTransactionMap[userId]) {
        userTransactionMap[userId] = {
          totalIncome: 0,
          totalExpense: 0,
          totalTurnover: 0,
        };
      }
      if (transaction.type === "Income" || transaction.type === "income") {
        userTransactionMap[userId].totalIncome += transaction.amount;
      } else if (transaction.type === "Expense" || transaction.type === "expense") {
        userTransactionMap[userId].totalExpense += transaction.amount;
      }
      userTransactionMap[userId].totalTurnover += transaction.amount;
    });

    // Format email users with transaction data
    const emailUsersWithData = emailUsers.map((user) => {
      const transactionData = userTransactionMap[user.expenseAppUserId] || {
        totalIncome: 0,
        totalExpense: 0,
        totalTurnover: 0,
      };

      return {
        userId: user.expenseAppUserId,
        email: user.email,
        phone: user.phoneNumber !== "Not Provided" ? user.phoneNumber : null,
        isVerified: user.isVerified,
        createdDate: user.createdAt,
        totalTurnover: transactionData.totalTurnover,
        totalIncome: transactionData.totalIncome,
        totalExpense: transactionData.totalExpense,
        registeredWith: "EMAIL",
        // Additional user details
        name: user.name,
        address: user.address !== "Not Provided" ? user.address : null,
        favoriteSport: user.favouriteSport !== "Not Provided" ? user.favouriteSport : null,
        gender: user.gender !== "Not Provided" ? user.gender : null,
      };
    });

    // Combine user data and sort by created date
    const usersWithData = emailUsersWithData.sort(
      (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
    );

    // Calculate summary statistics
    const totalUsers = usersWithData.length;
    const totalTurnover = usersWithData.reduce((sum, user) => sum + user.totalTurnover, 0);

    return res.status(200).json({
      status: "success",
      message: "Dashboard data fetched successfully!",
      data: {
        summary: {
          totalUsers,
          totalTurnover,
        },
        users: usersWithData,
      },
    });
  } catch (error) {
    console.error("Get dashboard data error:", error);
    return res.status(500).json({
      status: "failed",
      message: "Failed to fetch dashboard data.",
      error: error.message,
    });
  }
};

// Get Admin Profile
const getAdminProfile = async (req, res) => {
  try {
    const { adminId } = req.body;

    // Validate admin ID
    if (!adminId) {
      return res.status(400).json({
        status: "failed",
        message: "Admin ID is required!",
      });
    }

    // Find admin by ID
    const admin = await adminModel.findOne({
      adminId: adminId,
      isActive: true,
    });

    if (!admin) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid or inactive admin key!",
      });
    }

    // Return admin profile data (excluding sensitive info like adminKey)
    return res.status(200).json({
      status: "success",
      message: "Admin profile fetched successfully!",
      admin: {
        adminId: admin.adminId,
        email: admin.email,
        name: admin.name,
        phone: admin.phone,
        isPhoneVerified: admin.isPhoneVerified || false,
        isRequestApproved: admin.isRequestApproved,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error("Get admin profile error:", error);
    return res.status(500).json({
      status: "failed",
      message: "Failed to fetch admin profile.",
      error: error.message,
    });
  }
};

// Update Admin Phone Number
const updateAdminPhone = async (req, res) => {
  try {
    const { adminId, phone } = req.body;

    // Validate admin ID
    if (!adminId) {
      return res.status(400).json({
        status: "failed",
        message: "Admin ID is required!",
      });
    }

    // Validate phone number (optional, but if provided should be valid format)
    if (phone && phone.trim() !== "" && phone !== "Not Provided") {
      // Basic phone validation - you can enhance this
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
      if (!phoneRegex.test(phone.trim())) {
        return res.status(400).json({
          status: "failed",
          message: "Please provide a valid phone number format!",
        });
      }
    }

    // Find admin by ID
    const admin = await adminModel.findOne({
      adminId: adminId,
      isActive: true,
    });

    if (!admin) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid or inactive admin ID!",
      });
    }

    // Update phone number
    admin.phone = phone && phone.trim() !== "" ? phone.trim() : "Not Provided";
    await admin.save();

    // Return updated admin data
    return res.status(200).json({
      status: "success",
      message: "Phone number updated successfully!",
      admin: {
        adminId: admin.adminId,
        email: admin.email,
        name: admin.name,
        phone: admin.phone,
        isRequestApproved: admin.isRequestApproved,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error("Update admin phone error:", error);
    return res.status(500).json({
      status: "failed",
      message: "Failed to update phone number.",
      error: error.message,
    });
  }
};

// Send OTP for Admin Phone Verification
const sendOTPForAdminPhoneVerification = async (req, res) => {
  try {
    const { adminId, phoneNumber } = req.body;

    // Validate admin ID
    if (!adminId) {
      return res.status(400).json({
        status: "failed",
        message: "Admin ID is required!",
      });
    }

    // Validate phone number
    if (!phoneNumber) {
      return res.status(400).json({
        status: "failed",
        message: "Phone number field required...!",
      });
    }

    // Validate phone number format
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide a valid phone number format!",
      });
    }

    // Verify admin exists and is active
    const admin = await adminModel.findOne({
      adminId: adminId,
      isActive: true,
    });

    if (!admin) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid or inactive admin ID!",
      });
    }

    // Generate OTP: 6 digit random number
    const OTP = Math.floor(100000 + Math.random() * 900000);

    // Send OTP via SMS
    const messageData = {
      sender_id: "FSTSMS",
      message: `Your OTP for phone number verification is ${OTP} - Expense Management System (Admin).`,
      language: "english",
      route: "q",
      numbers: phoneNumber,
    };

    try {
      await sendSmsMock(phoneNumber, OTP);
      console.log("Mock SMS sent to:", phoneNumber);
    } catch (smsError) {
      console.error("SMS sending error:", smsError);
      // Continue even if SMS fails (for development/testing)
    }

    // Check if phone number already exists in AdminPhoneNumberModel
    const existingPhone = await AdminPhoneNumberModel.findOne({
      phoneNumber: phoneNumber,
    });

    if (existingPhone) {
      // Update OTP and link to admin
      existingPhone.otp = String(OTP);
      existingPhone.isVerified = false;
      existingPhone.adminId = adminId;
      await existingPhone.save();
    } else {
      // Create new entry
      const newAdminPhoneNumber = new AdminPhoneNumberModel({
        phoneNumber: phoneNumber,
        otp: String(OTP),
        adminId: adminId,
        isVerified: false,
      });
      await newAdminPhoneNumber.save();
    }

    return res.status(200).json({
      status: "success",
      message: "OTP sent successfully. Check your phone and verify with your OTP...!",
      phoneNumber: phoneNumber,
    });
  } catch (error) {
    console.error("Send admin phone OTP error:", error);
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong in sending OTP for phone number verification...!",
      error: error.message,
    });
  }
};

// Verify Admin Phone OTP and Update Profile
const verifyAdminPhoneOTP = async (req, res) => {
  try {
    const { adminId, phoneNumber, otp } = req.body;

    // Validate inputs
    if (!adminId) {
      return res.status(400).json({
        status: "failed",
        message: "Admin ID is required!",
      });
    }

    if (!phoneNumber || !otp) {
      return res.status(400).json({
        status: "failed",
        message: "Phone number and OTP are required...!",
      });
    }

    // Verify admin exists and is active
    const admin = await adminModel.findOne({
      adminId: adminId,
      isActive: true,
    });

    if (!admin) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid or inactive admin ID!",
      });
    }

    // Find phone record
    const phoneRecord = await AdminPhoneNumberModel.findOne({
      phoneNumber: phoneNumber,
      adminId: adminId,
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

    // Update admin phone number and verification status
    admin.phone = phoneNumber.trim();
    admin.isPhoneVerified = true;
    await admin.save();

    // Mark phone as verified in AdminPhoneNumberModel
    phoneRecord.isVerified = true;
    phoneRecord.otp = "null";
    await phoneRecord.save();

    return res.status(200).json({
      status: "success",
      message: "Phone number verified and updated successfully!",
      admin: {
        adminId: admin.adminId,
        email: admin.email,
        name: admin.name,
        phone: admin.phone,
        isPhoneVerified: admin.isPhoneVerified,
        isRequestApproved: admin.isRequestApproved,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error("Verify admin phone OTP error:", error);
    return res.status(500).json({
      status: "failed",
      message: "Failed to verify phone number.",
      error: error.message,
    });
  }
};

// Deactivate Admin Account
const deactivateAdminAccount = async (req, res) => {
  try {
    const { adminId } = req.body;

    // Validate admin ID
    if (!adminId) {
      return res.status(400).json({
        status: "failed",
        message: "Admin ID is required!",
      });
    }

    // Find admin by ID
    const admin = await adminModel.findOne({
      adminId: adminId,
      isActive: true, // Only allow deactivation if currently active
    });

    if (!admin) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid admin ID or account is already deactivated!",
      });
    }

    // Deactivate the account
    admin.isActive = false;
    await admin.save();

    return res.status(200).json({
      status: "success",
      message: "Your admin account has been deactivated successfully. You will be logged out.",
    });
  } catch (error) {
    console.error("Deactivate admin account error:", error);
    return res.status(500).json({
      status: "failed",
      message: "Failed to deactivate admin account.",
      error: error.message,
    });
  }
};

module.exports = {
  requestAdminAccess,
  adminLogin,
  getDashboardData,
  getAdminProfile,
  updateAdminPhone,
  sendOTPForAdminPhoneVerification,
  verifyAdminPhoneOTP,
  deactivateAdminAccount,
};
