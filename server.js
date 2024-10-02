const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

const authRoutes = require("./api/auth");
const todoRoutes = require("./api/todos");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 6969;

app.use(express.json());
app.use(cookieParser());
const mongoUri = process.env.MONGO_URI;
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
