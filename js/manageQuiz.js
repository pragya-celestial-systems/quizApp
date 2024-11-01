import { createOptions, saveSubmittedData } from "./global.js";

const cardsContainer = document.querySelector(".quiz-box");
const previewContainer = document.querySelector(".preview");
const message = document.querySelectorAll(".message");
const editButton = document.querySelector("#editButton");
let isEditing = false;

export function renderEditQuizForm() {
  window.open("../pages/manageQuizForm.html", "_self");
}

function createQuizCard(quizData) {
  const quizCardHtml = `
    <div class="quiz-card m-3">
      <div class="icon">
        <i class="fa-solid fa-list"></i>
      </div>
      <div class="title">${quizData.title}</div>
    </div>
    `;

  cardsContainer?.insertAdjacentHTML("beforeend", quizCardHtml);
}

function removeActiveClass() {
  const cards = Array.from(cardsContainer.children);
  cards.forEach((card) => {
    card.classList.remove("active-card");
  });
}

function addActiveClass(card) {
  card?.classList.add("active-card");
}

function displayMessage() {
  message.forEach((msg) => {
    msg.classList.remove("d-none");
    msg.classList.add("d-flex");
  });

  // hide the quiz card and preview container
  cardsContainer.classList.add("d-none");
  previewContainer.classList.add("d-none");
}

function displayPreview(questions, isEditing = false) {
  if (previewContainer) {
    previewContainer.innerHTML = "";
  }

  questions.forEach((question, index) => {
    addQuestion(question, index, isEditing);
  });
}

function addQuestion(questionData, questionIndex, isEditing) {
  const optionsHtml = createOptions(
    questionData.options,
    questionData.answerType,
    questionIndex,
    isEditing
  );

  const questionHtml = `
     <div class="question-box mb-3" data-question-number="${questionIndex}">
      <p class="question">${questionIndex + 1}. ${questionData.question}</p>
      <div class="options">${optionsHtml}</div>
      <div class="correct-answer">
        <b>Correct Answer </b> : <span>${questionData.correctAnswer}</span>
      </div>
    </div>
  `;

  previewContainer?.insertAdjacentHTML("beforeend", questionHtml);
}

function addSubmitButton() {
  const buttonHtml = `
    <div class="w-100 d-flex justify-content-end">
      <button type="button" class="btn btn-primary" id="submitBtn">Submit</button>
    </div>
  `;

  previewContainer.insertAdjacentHTML("beforeend", buttonHtml);
}

function addEventListenerOnCard(card, questions) {
  card?.addEventListener("click", () => {
    // remove active class on previous card
    removeActiveClass();
    displayPreview(questions);
    addActiveClass(card);
  });
}

function renderQuiz(quizData) {
  if (!quizData || quizData.length <= 0) {
    displayMessage();
    return;
  }

  quizData.forEach((quiz) => {
    createQuizCard(quiz);

    const quizCard = cardsContainer?.lastElementChild;
    addEventListenerOnCard(quizCard, quiz.questions);
  });

  const firstCard = cardsContainer?.firstElementChild;
  addActiveClass(firstCard);

  // display default quiz preview
  displayPreview(quizData[0].questions);
}

function updateQuiz(title) {
  const updatedData = JSON.parse(localStorage.getItem("answers"));
  const allQuiz = JSON.parse(localStorage.getItem("quiz"));

  const updatedQuiz = allQuiz.map((quiz) =>
    quiz.title === title
      ? {
          ...quiz,
          questions: quiz.questions.map((questionObj) => {
            const question = updatedData.find(
              (q) => q.question === questionObj.question
            );
            return { ...questionObj, correctAnswer: question.selectedOptions };
          }),
        }
      : quiz
  );

  // save the updated quiz array in local storage
  localStorage.setItem("quiz", JSON.stringify(updatedQuiz));
}

function getCurrentQuiz() {
  const title =
    document.querySelector(".active-card").lastElementChild.textContent;
  const allQuiz = JSON.parse(localStorage.getItem("quiz"));
  const currentQuiz = allQuiz.find((quiz) => quiz.title === title);
  return currentQuiz;
}

function handleSubmitButtonClick(button) {
  const currentQuiz = getCurrentQuiz();

  button.addEventListener("click", () => {
    saveSubmittedData(currentQuiz, previewContainer);
    updateQuiz(currentQuiz.title);

    const updatedQuiz = getCurrentQuiz();

    displayPreview(updatedQuiz.questions);
  });
}

editButton?.addEventListener("click", () => {
  isEditing = !isEditing;
  const currentQuiz = getCurrentQuiz();

  if (!isEditing) {
    displayPreview(currentQuiz.questions);
    return;
  }

  displayPreview(currentQuiz.questions, true);
  addSubmitButton();

  // add event listener on the submit button
  handleSubmitButtonClick(document.querySelector("#submitBtn"));
});

window.addEventListener("DOMContentLoaded", () => {
  const quiz = JSON.parse(localStorage.getItem("quiz"));
  renderQuiz(quiz);
});
