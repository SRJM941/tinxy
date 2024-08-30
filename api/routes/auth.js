const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Define your User schema
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");

dotenv.config();

// Register route
router.post("/register", async (req, res) => {
  const { name,email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({name, email, password: hashedPassword });

  try {
    await user.save();
    res.status(201).send("User registered");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send("Invalid credentials");
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://tinxy.onrender.com/api/auth/google/callback", // Correct callback URL path
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            name: profile.displayName,
            googleId: profile.id,
            email: profile.emails[0].value,
          });
          await user.save();
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Route to initiate Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route after Google authentication
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false, // Disable session if not required
  }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Redirect with token, replace this with an appropriate client URL if necessary
    res.redirect(`https://tinxy-frontend.onrender.com/generate?token=${token}`);
  }
);

module.exports = router;