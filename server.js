const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

const authRoutes = require("./api/auth");
const todoRoutes = require("./api/todos"); // Assuming you have todo routes as well

const app = express();
const PORT = process.env.PORT || 6969;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection (Replace with your actual MongoDB connection string)
mongoose.connect("mongodb+srv://renao:ccJorErFMstEDQgo@cluster0.kak04.mongodb.net/todo-renao", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Use routes
app.use("/api/auth", authRoutes);  // All auth routes (signup, signin) go under /api/auth
app.use("/api/todos", todoRoutes); // Example for todos if you have them

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
