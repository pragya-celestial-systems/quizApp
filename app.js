import { users } from "./database/userDatabase.js";

const loginForm = document.querySelector("#loginCard");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const radioButtons = document.querySelectorAll(".user-type");
const alertEl = document.querySelector(".alert");
const inputFields = document.querySelectorAll("input");

function resetInput() {
  username.value = "";
  console.log(password.value);
  password.value = "";
  console.log(password.value);
  radioButtons.forEach((btn) => (btn.checked = false));
  hideAlert();
}

function displayAlert(alertType, message) {
  // remove previous classlist
  alertEl.classList.remove(".alert-danger");
  alertEl.classList.remove(".alert-success");

  alertEl.classList.add(`.${alertType}`);
  alertEl.textContent = message;
  alertEl.style.opacity = 1;
}

function hideAlert() {
  alertEl.style.opacity = 0;
}

function handleFormSubmission(enteredData) {
  const user = findAndvalidateUser(enteredData);

  if (user?.status === 403) {
    displayAlert(".alert-error", user.message);
    return;
  }

  if (user?.status === 404) {
    displayAlert(".alert-error", user.message);
    return;
  }

  saveToken(user?.userType);

  // navigate to the home page
  displayHome(user?.userType);

  resetInput();
}

function displayHome(user) {
  if (user == "admin") {
    window.open("./pages/admin.html", "_self");
  } else {
    window.open("./pages/user.html", "_self");
  }
}

function saveToken(userType) {
  localStorage.setItem("quiz-token", "quizToken123");
  localStorage.setItem("user-type", userType);
}

function findAndvalidateUser(userData) {
  const idx = users.findIndex((user) => user.username === userData.username);

  // if user not found
  if (idx == -1) {
    return { status: 404, message: "user not found." };
  }

  //   if the entered credentials are incorrect
  if (users[idx].password !== userData.password) {
    return { status: 403, message: "username or password is incorrect." };
  }

  if (users[idx].userType !== userData.userType) {
    return { status: 404, message: "user not found." };
  }

  return { status: 200, userType: users[idx].userType };
}

// add event listener on the form
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let userType;
  radioButtons.forEach((btn) => {
    if (btn.checked) userType = btn.value;
  });

  const enteredData = {
    username: username.value,
    password: password.value,
    userType,
  };

  handleFormSubmission(enteredData);
});

// add event listener on the input fields
inputFields.forEach((inputEl) => {
  inputEl.addEventListener("focus", hideAlert);
});

window.addEventListener("DOMContentLoaded", () => {
  username.value = "admin";
  password.value = "admin@123";
});
