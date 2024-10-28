const form = document.querySelector("form");
const quizTitle = document.querySelector("#quiz");
const quiz = document.querySelector("#quizTitle");
const answerType = document.querySelector(".form-check");

export function renderForm() {
  window.open("../pages/form.html", "_self");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
});
