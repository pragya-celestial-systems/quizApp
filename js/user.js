import { authoriseUser, logoutUser } from "./global.js";

const quizContainer = document.querySelector("#quizContainer");
const messageContainer = document.querySelector("#message");
const logoutButton = document.querySelector(".logout-btn");
const mainContainer = document.querySelector(".content");
const messageBox = document.querySelector(".unauthorised-msg");

function createQuizCard(quizTitle) {
  const quizCardHtml = `
    <div class="quizBox">
        <div class="leftSide">
          <i class="fa-solid fa-list"></i>
        </div>
        <div class="rightSide">
          ${quizTitle}
        </div>
    </div>
    `;
  quizContainer.insertAdjacentHTML("beforeend", quizCardHtml);

  // add event listener on the card
  const quizCard = quizContainer.lastElementChild;
  addEventListenerOnCard(quizCard, quizTitle);
}

function addEventListenerOnCard(quizCard, quizTitle) {
  quizCard.addEventListener("click", () => {
    window.open(`../pages/quiz.html?quizTitle=${quizTitle}`, "_self");
  });
}

function displayMessage() {
  messageContainer.style.display = "flex";
  quizContainer.style.display = "none";
}

function hideMessage() {
  messageContainer.style.display = "none";
  quizContainer.style.display = "flex";
}

function displayQuizCard(quizArray) {
  quizArray.forEach((quiz) => {
    createQuizCard(quiz.title);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  authoriseUser(messageBox, mainContainer, "user");

  const quizArray = JSON.parse(localStorage.getItem("quiz"));

  if (quizArray.length <= 0) {
    displayMessage();
    return;
  }

  hideMessage();
  displayQuizCard(quizArray);
});

logoutButton.addEventListener("click", logoutUser);
