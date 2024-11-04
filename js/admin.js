import { renderForm } from "./createQuiz.js";
import { authoriseUser, logoutUser } from "./global.js";
import { renderEditQuizForm } from "./manageQuiz.js";

const buttons = document.querySelectorAll(".btn");
const messageElement = document.querySelector(".unauthorised-msg");
const logoutButton = document.querySelector(".logout-btn");
const mainContainer = document.querySelector("main");

// add event listener on each button
buttons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const buttonType = e.target.dataset.buttonType;

    // open new page
    renderContent(buttonType);
  });
});

function renderContent(buttonType) {
  if (buttonType === "create") {
    renderForm();
  }

  if (buttonType === "manage") {
    renderEditQuizForm();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  authoriseUser(messageElement, mainContainer, "admin");
});

logoutButton.addEventListener("click", logoutUser);
