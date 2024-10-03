// api/todos.js
const express = require("express");
const { TodoModel } = require("../db");
const { UserModel } = require("../db");
const { auth } = require("../middleware/auth"); // Import the authentication middleware
const path = require("path");
const router = express.Router();

router.use(express.static(path.join(__dirname, "..", "public")));

// Endpoint to create a new todo item
router.post("/user", auth, async (req, res) => {
  const { id: userId } = req.user; // Get the user's ID from the authenticated request
  const { title, description } = req.body; // Extract title and description from the request body

  try {
    const todo = await TodoModel.create({
      userId, // Associate the todo with the user
      title,
      description,
    });

    res.json({
      message: "Todo created successfully",
      todo, // Return the created todo
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while creating todo: " + error,
    });
  }
});

router.get("/redirect", auth, async (req, res) => {
  const userId = req.user; // Get the authenticated user's ID
  console.log("control reached here");
  if (userId) {
    res.sendFile(path.join(__dirname, "..", "public", "todo.html"));
  }
});
// Endpoint to retrieve todos for the authenticated user
router.get("/user", auth, async (req, res) => {
  const userId = req.user.id; // Get the user's ID from the authenticated request

  try {
    // Fetch the user's details
    const user = await UserModel.findById(userId).select("username");
    console.log("user");
    // Fetch todos from the database for this user
    const todos = await TodoModel.find({ userId });

    // Respond with both username and todos
    res.json({
      username: user ? user.username : "Unknown User", // Default to "Unknown User" if not found
      todos,
    });
  } catch (error) {
    console.error("Error fetching todos or user:", error);
    res.status(500).json({ message: "An error occurred while fetching todos" });
  }
});

// Endpoint to delete a todo item by ID
router.delete("/:id", auth, async (req, res) => {
  const todoId = req.params.id; // Get the todo ID from the request parameters
  const userId = req.user.id; // Get the user's ID from the authenticated request

  try {
    // Attempt to delete the todo
    const result = await TodoModel.deleteOne({ _id: todoId, userId });

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
router.put("/:id", auth, async (req, res) => {
  const todoId = req.params.id; // Get the todo ID from the request parameters
  const userId = req.user.id; // Get the user's ID from the authenticated request
  const { title, description } = req.body; // Extract title and description from the request body

  try {
    // Attempt to find and update the todo
    const updatedTodo = await TodoModel.findOneAndUpdate(
      { _id: todoId, userId }, // Ensure the todo belongs to the user
      { title, description },
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

module.exports = router; // Export the router
