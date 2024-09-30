// server.js
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const authRoutes = require("./api/auth");
const todoRoutes = require("./api/todos");

const app = express();
const PORT = process.env.PORT || 6969;

// Connect to MongoDB using Mongoose
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://renao:ccJorErFMstEDQgo@cluster0.kak04.mongodb.net/todo-renao"
  );
  console.log("Database connected successfully");
};
connectDB();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cookieParser());

// Serve static files (like HTML, CSS, JS) from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Use the API routes
app.use("/auth", authRoutes); // All auth routes will be prefixed with /auth
app.use("/todo", todoRoutes); // All todo routes will be prefixed with /todo

// Root endpoint to serve the main HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at PORT: ${PORT}`);
});
