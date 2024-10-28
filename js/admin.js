import { renderForm } from "./createQuiz.js";

const buttons = document.querySelectorAll(".btn");
const activeUser = document.querySelector(".active-user");

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
    // ...
    renderForm();
  } else if (buttonType === "manage") {
    // ...
  } else {
    // ...
  }
}

window.addEventListener("DOMContentLoaded", () => {
  activeUser.textContent = localStorage.getItem("user-type");
});
