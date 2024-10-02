// api/todos.js
const express = require("express");
const { TodoModel } = require("../db");
const { UserModel } = require("../db");
const { auth } = require("../middleware/auth"); // Create this middleware

const router = express.Router();

// Endpoint to create a new todo item
router.post("/", auth, async (req, res) => {
  const { id: userId } = req.user;
  const { title, description } = req.body;

  try {
    const todo = await TodoModel.create({
      userId,
      title,
      description,
    });
    console.log(todo);
    res.json({
      message: "Todo created successfully",
      todo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while creating todo: " + error,
    });
  }
});

// Endpoint to retrieve todos for the authenticated user

router.get("/", auth, async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch the user's details
    const user = await UserModel.findById(userId).select("username");

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
  const todoId = req.params.id;
  const userId = req.user.id;

  try {
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
  const todoId = req.params.id;
  const userId = req.user.id;
  const { title, description } = req.body;

  try {
    const updatedTodo = await TodoModel.findOneAndUpdate(
      { _id: todoId, userId },
      { title, description },
      { new: true }
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

module.exports = router;
