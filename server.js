// Import required libraries and modules
const express = require("express");
const { UserModel, TodoModel } = require("./db");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

// Set a secret key for signing and verifying tokens
const SECRET_KEY = "renaoisbest@genius";
const app = express();
const PORT = 6969;

// Connect to MongoDB using Mongoose
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://renao:ccJorErFMstEDQgo@cluster0.kak04.mongodb.net/todo-renao"
  );
  console.log("Database connected successfully");
};
connectDB();

// Serve static files (like HTML, CSS, JS) from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON request bodies
app.use(express.json());

// Root endpoint to serve the main HTML page
app.get("/", (req, res) => {
  const authHeader = req.headers.authorization;

  const userToken = authHeader && authHeader.split(" ")[1]; // Extract token from 'Bearer <token>'

  if (userToken) {
    try {
      jwt.verify(userToken, SECRET_KEY); // Verify the token
      res.json({ success: true }); // Indicate the token is valid
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } else {
    console.log("No token provided");
    res.status(401).json({ success: false, message: "No token provided" });
  }
});

// Authentication middleware
const auth = (req, res, next) => {
  const cookie = req.headers.cookie;
  if (!cookie) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  } else {
    const userTok = cookie.split("=");

    // Check if the token is present
    if (userTok.length === 2) {
      const token = userTok[1]; // The token is the second part

      try {
        const user = jwt.verify(token, SECRET_KEY); // Verify and decode token
        req.user = user; // Attach user data to request
        next(); // Proceed to the next middleware or route
      } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
      }
    } else {
      console.log("Token not found");
    }
  }
};

// Endpoint for user signup
app.post("/signup", async (request, response) => {
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
      token: token, // Include the token in the response
    });
  } catch (error) {
    response.status(500).json({
      message: "Something went wrong: " + error.message,
    });
  }
});

// Endpoint for user sign-in
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email, password });

    if (user) {
      const token = jwt.sign({ id: user._id }, SECRET_KEY);

      res.json({
        token, // Send token in the response body
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

// Endpoint to create a new todo item
app.post("/todo", auth, async (req, res) => {
  const { id: userId } = req.user; // Get the authenticated user's ID
  const title = req.body.title;
  const description = req.body.description;
  try {
    const todo = await TodoModel.create({
      userId,
      title,
      description,
    });

    res.json({
      message: "Todo created successfully",
      todo, // Return the newly created todo
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while creating todo: " + error,
    });
  }
});

// Endpoint to retrieve todos for the authenticated user
app.get("/todo", auth, async (req, res) => {
  const userId = req.user; // Get the authenticated user's ID

  if (userId) {
    res.sendFile(path.join(__dirname, "public", "todo.html"));
  }
});

app.get("/api/todos", auth, async (req, res) => {
  const userId = req.user.id; // Get the user's ID from the authenticated request

  console.log("User ID is: " + userId);

  // Fetch todos from the database for this user
  const todos = await TodoModel.find({ userId: userId });

  const user = await UserModel.findById(userId);
  console.log("User's Todos: ", todos);
  console.log("User's Name: " + user.username);

  // Map todos to include their details in the response
  const list = todos.map((element) => ({
    id: element._id, // Include the todo ID
    title: element.title,
    description: element.description,
    userId: element.userId,
  }));

  res.json({
    username: user.username,
    todos: list, // Send the list of todos in the response
  });
});

// Endpoint to delete a todo item by ID
app.delete("/todo/:id", auth, async (req, res) => {
  const todoId = req.params.id; // Get the todo ID from the request parameters
  const userId = req.user.id; // Get the authenticated user's ID

  try {
    // Delete the todo from the database
    const result = await TodoModel.deleteOne({ _id: todoId, userId: userId });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Todo not found or does not belong to user" });
    }

    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting todo: " + error.message });
  }
});

// Endpoint to update a todo item by ID
app.put("/todo/:id", auth, async (req, res) => {
  const todoId = req.params.id; // Get the todo ID from the request parameters
  const userId = req.user.id; // Get the authenticated user's ID
  const { title, description } = req.body; // Extract title and description from the request body

  try {
    // Find the todo and update it
    const updatedTodo = await TodoModel.findOneAndUpdate(
      { _id: todoId, userId: userId }, // Find the todo belonging to the user
      { title, description }, // Update fields
      { new: true } // Return the updated document
    );

    if (!updatedTodo) {
      return res
        .status(404)
        .json({ message: "Todo not found or does not belong to user" });
    }

    res.json({ message: "Todo updated successfully", todo: updatedTodo });
  } catch (error) {
    res.status(500).json({ message: "Error updating todo: " + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT: ${PORT}`);
});
