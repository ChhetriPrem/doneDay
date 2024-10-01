import { showToast } from "./components/toast/toast.js";

const fetchName = async () => {
  try {
    const response = await fetch("/api/auth/todos/");
    const data = await response.json();
    const username = data.username;
    const greet = document.getElementById("greet");
    greet.innerHTML = "What's on your mind, " + username;
  } catch {
    console.log("error");
  }
};

fetchName();

const addTodo = async () => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  if (!title) {
    showToast("error", "Title is required!");
    return;
  }
  try {
    await axios.post("/api/auth/todos/", {
      title,
      description,
    });
    showToast("success", "Todo added successfully!"); // Show success toast
    run(); // Refresh todos after adding
  } catch (error) {
    console.error("Error adding todo:", error);
  }
};

// Make addTodo globally accessible

const refreshTodo = (id, title, description) => {
  const main = document.getElementById("main");

  const newDiv = document.createElement("div");
  newDiv.classList.add("todo-item");

  // Create a div for title and description
  const textDiv = document.createElement("div");
  textDiv.classList.add("text-div"); // Add new class for styling
  const btnDiv = document.createElement("div");
  btnDiv.classList.add("btnDiv"); // Add new class for buttons

  // Create elements for title and description
  const titleElement = document.createElement("h3");
  titleElement.innerHTML = "Title: " + title;
  titleElement.classList.add("todo-title");

  const descriptionElement = document.createElement("p");
  descriptionElement.innerHTML = description;
  descriptionElement.classList.add("todo-description");

  // Append title and description to textDiv
  textDiv.appendChild(titleElement);
  textDiv.appendChild(descriptionElement);

  const editBtn = document.createElement("button");
  const deleteBtn = document.createElement("button");

  editBtn.innerText = "Edit";
  deleteBtn.innerText = "Delete";

  editBtn.onclick = () => {
    if (editBtn.innerText === "Edit") {
      // Switch to input fields
      const titleInput = document.createElement("input");
      const descriptionInput = document.createElement("input");

      titleInput.value = title;
      descriptionInput.value = description;
      titleInput.classList.add("edit-input");
      descriptionInput.classList.add("edit-input");

      // Change appearance to input fields
      textDiv.replaceChild(titleInput, titleElement);
      textDiv.replaceChild(descriptionInput, descriptionElement);
      editBtn.innerText = "Save"; // Change button text to "Save"

      editBtn.onclick = () => {
        // Save changes
        updateTodo(id, titleInput.value, descriptionInput.value);
        titleElement.innerHTML = titleInput.value; // Update displayed title
        descriptionElement.innerHTML = descriptionInput.value; // Update displayed description
        textDiv.replaceChild(titleElement, titleInput); // Replace input with title
        textDiv.replaceChild(descriptionElement, descriptionInput); // Replace input with description
        editBtn.innerText = "Edit"; // Change button text back to "Edit"
      };
    }
  };

  deleteBtn.onclick = () => deleteTodo(id); // Delete todo

  // Append buttons to btnDiv
  btnDiv.appendChild(editBtn);
  btnDiv.appendChild(deleteBtn);

  // Append textDiv and btnDiv to the main todo item div
  newDiv.appendChild(textDiv);
  newDiv.appendChild(btnDiv);
  main.appendChild(newDiv);
};

const run = async () => {
  const main = document.getElementById("main");
  const existingTodos = Array.from(main.children); // Get existing todos

  try {
    const response = await fetch("/api/auth/todos/");
    const data = await response.json();

    const todos = data.todos;

    // Remove existing todos from the display
    existingTodos.forEach((todo) => main.removeChild(todo));

    // Add fetched todos to the display
    todos.forEach((element) => {
      refreshTodo(element.id, element.title, element.description);
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
};

const updateTodo = async (id, title, description) => {
  try {
    await axios.put(`/todo/${id}`, { title, description });
    run(); // Refresh todos after updating
  } catch (error) {
    console.error("Error updating todo:", error);
  }
};

const deleteTodo = async (id) => {
  try {
    await axios.delete(`/todo/${id}`);
    run(); // Refresh todos after deleting
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};

const signout = () => {
  document.cookie = "token=; Max-Age=0; path=/;";
  console.log(document.cookie);
  window.location.href = "/"; // Redirect to the homepage
};

// Initial fetch when the page loads
// Attach functions to the window object for global accessibility
window.addTodo = addTodo;
window.run = run; // Ensure run is globally accessible
window.signout = signout; // Ensure signout is globally accessible
