// api/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../db");

const router = express.Router();
const SECRET_KEY = "renaoisbest@genius";

// Endpoint for user signup
router.post("/signup", async (request, response) => {
  try {
    const { email, password, username } = request.body;

    const user = await UserModel.create({
      email,
      password,
      username,
    });

    const token = jwt.sign({ id: user._id }, SECRET_KEY);

    response.json({
      message: "User created successfully",
      success: true,
      token: token,
    });
  } catch (error) {
    response.status(500).json({
      message: "Something went wrong: " + error.message,
    });
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
    res.status(500).json({ message: "Error during sign-in: " + error });
  }
});

module.exports = router;
