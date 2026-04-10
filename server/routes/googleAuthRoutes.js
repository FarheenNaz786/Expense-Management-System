// routes/googleAuthRoutes.js
const express = require("express");
const passport = require("../controllers/auth.googleAuth");
const CLIENT_URL = require("../utils/baseURL");
const GoogleAuthRoutes = express.Router();

// Redirect to Google OAuth
GoogleAuthRoutes.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
GoogleAuthRoutes.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      // Ensure user and token are correctly set
      if (!req.user) {
        return res.redirect(`${CLIENT_URL}/login?error=auth_failed`);
      }

      const { user, token } = req.user;

      // Redirect with the user token and details
      res.redirect(
        `${CLIENT_URL}/google-auth-success?token=${token}&expenseAppUserId=${
          user.expenseAppUserId
        }&name=${encodeURIComponent(user.name)}&isVerified=${user.isVerified}`
      );
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect(`${CLIENT_URL}/login?error=server_error`);
    }
  }
);

module.exports = GoogleAuthRoutes;
