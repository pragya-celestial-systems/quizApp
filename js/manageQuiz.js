import { authoriseUser, createOptions, saveSubmittedData } from "./global.js";

const cardsContainer = document.querySelector(".quiz-box");
const previewContainer = document.querySelector(".preview-container");
const previewBox = document.querySelector(".preview");
const message = document.querySelectorAll(".message");
const editButton = document.querySelector("#editButton");
const mainContainer = document.querySelector("main");
const messageEl = document.querySelector(".unauthorised-msg");
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
  if (previewBox) {
    previewBox.innerHTML = "";
  }

  questions.forEach((question, index) => {
    addQuestion(question, index, isEditing);
  });

  const trashButtons = document.querySelectorAll(".fa-trash");
  handleDeleteButtonClick(trashButtons);
}

function addQuestion(questionData, questionIndex, isEditing) {
  const optionsHtml = createOptions(
    questionData.options,
    questionData.answerType,
    questionIndex,
    isEditing
  );

  const questionHtml = isEditing
    ? `<div class="question-box mb-3" data-question-number="${questionIndex}">
      <div>
        <p class="question">${questionIndex + 1}. ${questionData.question}</p>
        <div class="options">${optionsHtml}</div>
        <div class="correct-answer">
          <b>Correct Answer </b> : <span>${questionData.correctAnswer}</span>
        </div>
      </div>
      <i class="fa-solid fa-trash"></i>
    </div>`
    : `<div class="question-box d-block mb-3" data-question-number="${questionIndex}">
        <p class="question">${questionIndex + 1}. ${questionData.question}</p>
        <div class="options">${optionsHtml}</div>
        <div class="correct-answer">
          <b>Correct Answer </b> : <span>${questionData.correctAnswer}</span>
        </div>
    </div>`;

  previewBox?.insertAdjacentHTML("beforeend", questionHtml);
}

function handleDeleteButtonClick(buttons) {
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const confirm = window.confirm(
        "Are you sure you want to delete this question? This action can't be undo."
      );
      if (!confirm) return;

      // Get the question number from the clicked element
      const questionBox = e.target.closest(".question-box");
      if (questionBox) {
        const questionNumber = parseInt(questionBox.dataset.questionNumber);
        const currentQuiz = getCurrentQuiz();

        // Filter out the question
        const updatedQuestions = currentQuiz.questions.filter(
          (_, index) => index !== questionNumber
        );

        const updatedQuiz = {
          ...currentQuiz,
          questions: updatedQuestions,
        };

        const allQuiz = JSON.parse(localStorage.getItem("quiz"));
        let updatedQuizArray;

        if (updatedQuestions.length <= 0) {
          updatedQuizArray = updatedQuizArray = allQuiz.filter(
            (quiz) => quiz.title !== currentQuiz.title
          );
        } else {
          updatedQuizArray = allQuiz.map((quiz) => {
            if (quiz.title === currentQuiz.title) {
              return updatedQuiz;
            }
          });
        }

        // Save the updated quiz back to local storage
        localStorage.setItem("quiz", JSON.stringify(updatedQuizArray));

        if (updatedQuestions.length <= 0) {
          renderQuiz(updatedQuizArray);
          return;
        }

        displayPreview(updatedQuiz.questions, true);
      } else {
        alert("Oops! Something went wrong.");
      }
    });
  });
}

function addSubmitButton() {
  const buttonHtml = `
    <div class="w-100 d-flex justify-content-end">
      <button type="button" class="btn btn-primary" id="submitBtn">Submit</button>
    </div>
  `;

  previewBox.insertAdjacentHTML("beforeend", buttonHtml);
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

  // clear previous quiz html if present
  if (cardsContainer) {
    cardsContainer.innerHTML = "";
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

            // update correct answer only if user has selected one
            if (
              !question.selectedOptions ||
              question.selectedOptions.length <= 0
            ) {
              return { ...questionObj };
            }

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
  button.addEventListener("click", () => {
    const currentQuiz = getCurrentQuiz();
    saveSubmittedData(currentQuiz, previewBox);
    updateQuiz(currentQuiz.title);

    renderQuiz(JSON.parse(localStorage.getItem("quiz")));
    alert("Quiz edit successfully.");
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
  authoriseUser(messageEl, mainContainer);

  const quiz = Array.from(JSON.parse(localStorage.getItem("quiz")));
  renderQuiz(quiz);
});
