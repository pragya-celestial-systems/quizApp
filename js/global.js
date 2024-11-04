function getQuizTitle() {
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const quizTitle = params.get("quizTitle");
  return quizTitle;
}

export function getQuizData() {
  const quizArray = JSON.parse(localStorage.getItem("quiz"));
  const quizData = quizArray.find((quiz) => quiz.title === getQuizTitle());
  return quizData;
}

export function createOptions(
  optionsArray,
  answerType,
  questionIndex,
  isEditing = false
) {
  const type = answerType === "MCQ" ? "radio" : "checkbox";
  const prefix =
    answerType === "MCQ"
      ? `<i class="fa-regular fa-circle"></i>`
      : `<i class="fa-regular fa-square"></i>`;

  return optionsArray
    .map((option) =>
      !isEditing
        ? `<div class="option">${prefix} ${option}</div>`
        : `<div class="option">
            <input type="${type}" name="question-${questionIndex}" value="${option}" /> ${option}
          </div>`
    )
    .join("");
}

export function saveSubmittedData(quizData, inputContainer) {
  const answers = quizData.questions.map((question, index) => {
    // Array.from - it will convert the nodelist into an array
    let selectedOptions = Array.from(
      inputContainer?.querySelectorAll(
        `input[name="question-${index}"]:checked`
      )
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

function displayNotAuthorised(messageEl, mainContainer) {
  messageEl?.classList.remove("d-none");
  mainContainer?.classList.add("d-none");
}

function hideNotAuthorised(messageEl, mainContainer) {
  messageEl?.classList.add("d-none");
  mainContainer?.classList.remove("d-none");
}

export function authoriseUser(messageEl, mainContainer, userType) {
  const token = localStorage.getItem("quiz-token");

  if (userType === "admin") {
    if (!token || token !== "admin-token-xyz123") {
      displayNotAuthorised(messageEl, mainContainer);
      return;
    }
  } else if (userType == "user") {
    if (!token || token !== "user-token-xyz123") {
      displayNotAuthorised(messageEl, mainContainer);
      return;
    }
  }

  hideNotAuthorised(messageEl, mainContainer);
}

export function logoutUser() {
  localStorage.removeItem("quiz-token");
  window.open("../index.html");
}

export function saveToken(userType) {
  if (userType === "admin") {
    localStorage.setItem("quiz-token", "admin-token-xyz123");
  }

  if (userType === "user") {
    localStorage.setItem("quiz-token", "user-token-xyz123");
  }
}
