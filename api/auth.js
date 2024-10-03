const express = require("express");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../db"); // Adjust according to your structure
require("dotenv").config();
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

// Endpoint for user signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Create user
    const user = await UserModel.create({
      email,
      password,
      username,
    });

    const token = jwt.sign({ id: user._id }, SECRET_KEY);
    res.json({
      message: "User created successfully",
      success: true,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong: " + error.message });
  }
});

// Endpoint for user sign-in
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email, password });

    if (user) {
      const token = jwt.sign({ id: user._id }, SECRET_KEY);
      res.json({
        token,
        message: "User logged in successfully",
        success: true,
      });
    } else {
      res.status(404).json({ message: "User not found", noAccount: true });
    }
  } catch (error) {
    res.status(500).json({ message: "Error during sign-in: " + error.message });
  }
});

module.exports = router;
