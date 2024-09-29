// Import required libraries and modules
const express = require("express"); // Express framework for building web applications
const { UserModel, TodoModel } = require("./db"); // Import the User and Todo models from our database file
const jwt = require("jsonwebtoken"); // Library for working with JSON Web Tokens
const mongoose = require("mongoose"); // Library for interacting with MongoDB
const path = require("path"); // Library for handling file and directory paths

// Set a secret key for signing and verifying tokens
const SECRET_KEY = "renaoisbest@genius";
const app = express(); // Create an instance of Express
const PORT = 6969; // Define the port number for our server

// Connect to MongoDB using Mongoose
mongoose.connect(
  "mongodb+srv://renao:ccJorErFMstEDQgo@cluster0.kak04.mongodb.net/todo-renao"
);

// Serve static files (like HTML, CSS, JS) from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON request bodies, making it easier to work with incoming data
app.use(express.json());

// Root endpoint that serves the main HTML page
app.get("/", (req, res) => {
  const token = req.headers.token; // Get the token from request headers
  if (token) {
    res.redirect("/todo"); // If there's a token, redirect to the /todo page
  } else {
    console.log("Token doesn't exist"); // Log a message if there's no token
    // You might want to send a message here to inform the user to sign in
  }
});

// Authentication middleware to protect certain routes
const auth = (req, res, next) => {
  const token = req.headers.token; // Get the token from request headers
  if (!token) {
    return res.status(401).json({ message: "No token provided" }); // Respond with 401 if no token is found
  }

  try {
    const user = jwt.verify(token, SECRET_KEY); // Verify the token and decode it
    req.user = user; // Attach the user data to the request object
    console.log(user.id); // Log the user's ID for debugging purposes
    next(); // Move on to the next function or route
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" }); // Handle errors during token verification
  }
};

// Endpoint for user signup
app.post("/signup", (request, response) => {
  const createData = async () => {
    try {
      // Extract email, password, and username from the request body
      const { email, password, username } = request.body;

      // Create a new user in the database
      await UserModel.create({
        email,
        password,
        username,
      });

      // Send a success response back to the client
      const token = req.headers.token;
      response.setHeader("token", token); // (Optional) Set an auth header
      response.json({
        message: "User created successfully", // Success message
        success: true, // Indicate success
      });
    } catch (error) {
      // Send an error response if something goes wrong
      response.status(500).json({
        message: "Something went wrong: " + error,
      });
    }
  };

  createData(); // Call the function to create user data
});

// Endpoint for user sign-in
app.post("/signin", (request, respond) => {
  const syncUser = async () => {
    // Get the email from the request body
    const { email } = request.body;

    // Check if the user exists in the database
    const user = await UserModel.findOne({ email });

    if (user) {
      // If user is found, create a token
      const token = jwt.sign({ id: user._id }, SECRET_KEY);

      respond.setHeader("token", token); // Send the token back in the response headers
      respond.json({
        token, // Include the token in the response
        message: "User logged in successfully", // Success message
        success: true, // Indicate success
      });
    } else {
      console.log("User not found"); // Log if no user is found
      respond.status(404).json({ message: "User not found" }); // Respond with a not found error
    }
  };

  syncUser(); // Call the function to synchronize user data
});

// Endpoint to create a new todo item
app.post("/todo", auth, async (req, res) => {
  const user = req.user; // Get the authenticated user from the request
  console.log("User in /todo is: " + user.id); // Log the user's ID for debugging

  const userId = user.id; // Get the user's ID
  try {
    // Create a new todo item in the database
    await TodoModel.create({
      userId, // Associate the todo with the user ID
      title: "This is the todo title", // Example title
      description: "This is the todo description", // Example description
    });

    // Send a success message back to the client
    res.json({
      message: "Todo created successfully",
    });
  } catch (error) {
    console.error(error); // Log any errors that occur
    res.status(500).json({
      message: "Something went wrong while creating todo",
    });
  }
});

// Endpoint to retrieve todos for the authenticated user
app.get("/todo", auth, async (req, res) => {
  const user = req.user; // Get the authenticated user
  const userId = user.id; // Extract the user's ID

  try {
    // Find all todo items that belong to the user
    const todos = await TodoModel.find({ userId: userId });

    // Format the todos to only include title and description
    const formattedTodos = todos.map((todo) => ({
      title: todo.title,
      description: todo.description,
    }));

    // Send back the formatted todos as a JSON response
    res.json({ todos: formattedTodos });
  } catch (error) {
    console.error(error); // Log any errors that occur
    res.status(500).json({ message: "Error retrieving todos" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT: ${PORT}`);
});
