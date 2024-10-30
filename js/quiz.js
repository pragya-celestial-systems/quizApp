const form = document.querySelector("#test");
const quizTitle = document.querySelector("#quizTitle");
const overlay = document.querySelector(".overlay");
const modalContent = document.querySelector("#modalContent");
const resultContainer = document.querySelector(".result");

function getQuizTitle() {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const quizTitle = params.get("quizTitle");
  return quizTitle;
}

function getQuizData() {
  const quizArray = JSON.parse(localStorage.getItem("quiz"));
  const quizData = quizArray.find((quiz) => quiz.title === getQuizTitle());
  return quizData;
}

function renderQuestions(questionsArray) {
  questionsArray.forEach((quizObj, index) => {
    const options = createOptions(quizObj.options, quizObj.answerType, index);

    const questionHtml = `
        <div class="questionBox" data-question-number="${index}">
          <p class="question">Qus : ${quizObj.question}</p>
          <div class="options">
            ${options}
          </div>
        </div>
      `;

    form.insertAdjacentHTML("afterbegin", questionHtml);
  });
}

function createOptions(optionsArray, optionType, questionIndex) {
  const type = optionType === "MCQ" ? "radio" : "checkbox";
  let options = "";

  optionsArray.forEach((option) => {
    options += `
            <div class="option">
            <input type="${type}" name="question-${questionIndex}" value="${option}" /> ${option}
            </div>
            `;
  });

  return options;
}

function createModalContent(result) {}

function displayModal() {
  overlay.classList.remove("d-none");
  overlay.classList.add("d-flex");
}

function hideModal() {
  overlay.classList.add("d-none");
  overlay.classList.remove("d-flex");
}

function calculateResult({ answers, quizData }) {
  const { questions } = quizData;

  let correctCount = 0;

  questions.forEach((quizObj, index) => {
    const userAnswer = answers.find(
      (ansObj) => ansObj.question === quizObj.question
    );

    if (userAnswer) {
      const isCorrect = Array.isArray(userAnswer.selectedOptions)
        ? // convert both the array in string as we can't compare arrays because they are reference type
          JSON.stringify(userAnswer.selectedOptions) ===
          JSON.stringify(quizObj.correctAnswers)
        : userAnswer.selectedOptions === quizObj.correctAnswer;

      if (isCorrect) {
        correctCount++;
      }
    }
  });

  const scorePercentage = (correctCount / questions.length) * 100;
  return { score: scorePercentage, correctCount, questions: questions.length };
}

function displayResult(resultData) {
  // clear the previous result
  resultContainer.innerHTML = "";

  const resultHtml = `
  <h2 id="heading">Your Score</h3>
            <h3 id="score">${resultData.correctCount}/${resultData.questions}</h3>
          <p id="text">Your score is ${resultData.score}%. You Answered ${resultData.correctCount} question out of ${resultData.questions} questions correct.</p>
  `;

  resultContainer.insertAdjacentHTML("afterbegin", resultHtml);
}

function saveSubmittedData() {
  const quizData = getQuizData();
  const answers = quizData.questions.map((question, index) => {
    // Array.from - it will convert the nodelist into an array
    let selectedOptions = Array.from(
      form.querySelectorAll(`input[name="question-${index}"]:checked`)
    ).map((input) => input.value);

    if (question.answerType === "MCQ") {
      selectedOptions = selectedOptions[0];
    }

    return {
      question: question.question,
      answerType: question.answerType,
      selectedOptions,
    };
  });

  // save answers in the local storage
  localStorage.setItem("answers", JSON.stringify(answers));
  return { answers, quizData };
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const response = saveSubmittedData();

  // calculate the result
  const result = calculateResult(response);

  // display result
  displayModal();
  displayResult(result);
});

window.addEventListener("DOMContentLoaded", () => {
  const quizData = getQuizData();

  // Set the quiz title
  quizTitle.textContent = quizData.title;

  renderQuestions(quizData.questions);
});

window.addEventListener("load", () => {
  // clear the stored answers
  localStorage.removeItem("answers");
});

overlay.addEventListener("click", (e) => {
  if (
    e.target === e.target.closest("#modalContent") ||
    e.target === e.target.closest(".result")
  )
    return;

  // if the target is close button
  if (e.target === e.target.closest(".fa-xmark")) {
    hideModal();
    return;
  }

  hideModal();
});