// controllers/auth.googleAuth.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const GoogleAuthUserModel = require("../models/model.user.googleAuth");
const dotenv = require("dotenv");
const { customAlphabet } = require("nanoid");
const userModel = require("../models/userModel");

dotenv.config();

const JWT_SECRET_KEY = "expense-management-system-secret-key";
const JWT_EXPIRE_IN = "60m";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 10); // 10 characters length Nanoid

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
const isGoogleAuthEnabled =
  Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_CALLBACK_URL);

if (isGoogleAuthEnabled) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;

          // Check if the user exists in GoogleAuthUserModel by Google ID
          let user = await GoogleAuthUserModel.findOne({ googleId: profile.id });

          // If user does not exist, create a new Google auth user with separate expenseAppUserId
          // No linking with email/password users - they are completely separate
          if (!user) {
            // Create a new Google auth user with unique expenseAppUserId
            user = await GoogleAuthUserModel.create({
              expenseAppUserId: nanoid(),
              googleId: profile.id,
              name: profile.displayName,
              email,
              isVerified: true,
            });
          }

          // Generate JWT token
          const token = jwt.sign(
            { expenseAppUserId: user.expenseAppUserId },
            JWT_SECRET_KEY,
            { expiresIn: JWT_EXPIRE_IN }
          );

          return done(null, { user, token });
        } catch (err) {
          console.error("Google Auth Error: ", err);
          return done(err, null);
        }
      }
    )
  );
} else {
  console.warn(
    "Google auth disabled: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_CALLBACK_URL not provided."
  );
  passport.authenticate = function (strategy, options) {
    return (req, res) => {
      res.status(503).json({
        status: "failed",
        message: "Google authentication is disabled on this server.",
      });
    };
  };
}

module.exports = passport;
