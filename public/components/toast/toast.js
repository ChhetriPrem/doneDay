// Object containing details for different types of toasts
const toastDetails = {
  timer: 5000,
  success: {
    icon: "fa-circle-check",
    text: "Success: Todo added successfully ",
  },
  error: {
    icon: "fa-circle-xmark",
    text: "Error: This is an error toast.",
  },
  warning: {
    icon: "fa-triangle-exclamation",
    text: "Warning: This is a warning toast.",
  },
  info: {
    icon: "fa-circle-info",
    text: "Info: This is an information toast.",
  },
};

// Function to remove a toast from the DOM
const removeToast = (toast) => {
  toast.classList.add("hide");
  if (toast.timeoutId) clearTimeout(toast.timeoutId); // Clearing the timeout for the toast
  setTimeout(() => toast.remove(), 500); // Removing the toast after 500ms
};

// Main function to show a toast notification
export const showToast = (type, message) => {
  const toastDetails = {
    success: {
      icon: "fa-circle-check",
      text: message || "Success: This is a success toast.",
    },
    error: {
      icon: "fa-circle-xmark",
      text: message || "Error: This is an error toast.",
    },
    warning: {
      icon: "fa-triangle-exclamation",
      text: message || "Warning: This is a warning toast.",
    },
    info: {
      icon: "fa-circle-info",
      text: message || "Info: This is an information toast.",
    },
  };

  const toast = document.createElement("li");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<div class="column">
                             <i class="fa-solid ${toastDetails[type].icon}"></i>
                             <span id = "span">${toastDetails[type].text}</span>
                          </div>
                          <i class="fa-solid fa-xmark" onclick="removeToast(this.parentElement)"></i>`;
  document.querySelector(".notifications-container").appendChild(toast);
  setTimeout(() => removeToast(toast), 5000);
};
