import { authoriseUser } from "./global.js";

const addQuestionButton = document.querySelector("#addQuestionButton");
const quizTitle = document.querySelector("#quizTitle");
const question = document.querySelector("#question");
const optionForm = document.querySelector("#optionForm");
const option = document.querySelector("#option");
const addOptionButton = document.querySelector("#addOptionButton");
const optionsContainer = document.querySelector("#optionsContainer");
const questionsContainer = document.querySelector("#questionsContainer");
const discardButton = document.querySelector("#discardButton");
const alertBox = document.querySelector("#alertBox");
const inputElements = document.querySelectorAll("input");
const createQuizButton = document.querySelector("#createQuizButton");
const messageEl = document.querySelector(".unauthorised-msg");
const mainContainer = document.querySelector("main");
const optionsType = document.querySelectorAll(".answer-type");
let answerType;
const questionsArray = [];

export function renderForm() {
  window.open("../pages/createQuizForm.html", "_self");
}

function getCorrectAnswer() {
  return Array.from(optionsContainer.children).filter((option) => {
    if (option.firstElementChild.checked) {
      return option.firstElementChild;
    }
  });
}

function resetInput() {
  const answerType = document.querySelector(".answer-type:checked");
  question.value = "";
  option.value = "";
  optionsContainer.innerHTML = "";
  answerType.checked = false;
}

function displayAlert(
  alertType = "alert-primary",
  message = "Something went wrong."
) {
  // remove the opacity-0 and previously added classes
  alertBox.classList.remove("opacity-0", "alert-danger", "alert-success");

  alertBox.classList.add(alertType, "opacity-100");
  alertBox.textContent = message;
}

function hideAlert() {
  alertBox.classList.remove("opacity-100");
  alertBox.classList.add("opacity-0");
}

function addOption(option, optionType) {
  const answerType = document.querySelector(".answer-type:checked")?.value;
  optionType = answerType === "checkBox" ? "checkbox" : "radio";

  const optionHtml = `
<div class="option">
<input type="${optionType}" name="option" value="${option}"/> ${option}
</div>
`;

  optionsContainer.insertAdjacentHTML("beforeend", optionHtml);
}

function getOptions() {
  const options = Array.from(optionsContainer.children);

  // Array.from(nodelist) will convert the nodelist into an array
  return options.map((option) => option.firstElementChild.value);
}

function checkEmptyField() {
  if (quizTitle.value === "") {
    displayAlert("alert-danger", "Please fill the quiz title.");
    return { status: 204 };
  } else if (question.value === "") {
    displayAlert("alert-danger", "Please enter the question.");
    return { status: 204 };
  } else if (answerType === null) {
    displayAlert("alert-danger", "Please select the answer type.");
    return { status: 204 };
  } else if (optionsContainer.children.length < 2) {
    displayAlert("alert-danger", "Please add at least 2 options.");
    return { status: 204 };
  } else {
    return { status: 200 };
  }
}

function saveQuiz(questions) {
  const allQuiz = JSON.parse(localStorage.getItem("quiz"));
  const hasSameTitle = allQuiz.findIndex(
    (quiz) => quiz.title === quizTitle.value
  );

  if (hasSameTitle !== -1) {
    displayAlert("alert-danger", "Quiz with same title already exists.");
    return true;
  }

  const quizObj = {
    title: quizTitle.value,
    questions,
  };

  const quizArray = JSON.parse(localStorage.getItem("quiz")) || [];
  quizArray.push(quizObj);

  // save the updated array in the local storage
  localStorage.setItem("quiz", JSON.stringify(quizArray));
  return false;
}

function getQuestionData() {
  let correctAnswer = getCorrectAnswer();

  if (!correctAnswer || correctAnswer.length <= 0) {
    return {
      status: 204,
      message: "Please select the correct answer for the question.",
    };
  }

  // if the answer type is MCQ
  if (answerType === "MCQ") {
    correctAnswer = correctAnswer[0].firstElementChild.value;
  } else {
    correctAnswer = correctAnswer.map((ans) => ans.firstElementChild.value);
  }

  const quizData = {
    question: question.value,
    options: getOptions(),
    answerType,
    correctAnswer,
  };

  // push the question's data in the questions array
  questionsArray.push(quizData);
  return { status: 201, quizData };
}

function addQuestion(questionData) {
  const optionsHtml = questionData.options
    .map(
      (option, index) => `
<p>${String.fromCharCode(65 + index)}. ${option}</p>
`
    )
    .join("");

  const correctAnswerHtml = Array.isArray(questionData.correctAnswer)
    ? questionData.correctAnswer.join(", ")
    : questionData.correctAnswer;

  // Create the full HTML for the question
  const questionHtml = `
<div class="questionBox">
<p class="question">Qus : ${questionData.question}</p>
<div class="options">
${optionsHtml}
</div>
<div class="correct-answer">
<b>Correct Answer</b>: <span class="correctAnswer">${correctAnswerHtml}</span>
</div>
</div>
`;

  // Append the question HTML to the questions container
  questionsContainer?.insertAdjacentHTML("beforeend", questionHtml);
}

function checkDuplicateOption(option) {
  const options = Array.from(optionsContainer.children);
  let hasDuplicateoption = false;

  options.forEach((opt) => {
    if (opt.firstElementChild.value.trim() === option) {
      hasDuplicateoption = true;
    }
  });

  return hasDuplicateoption;
}

function checkAnswerType() {
  const prevOptionType =
    optionsContainer?.firstElementChild?.firstElementChild?.type;

  if (prevOptionType === null) {
    return false;
  }

  if (optionsContainer.childElementCount >= 1) {
    if (!prevOptionType) {
      displayAlert("alert-danger", "Please select the answer type.");
      return true;
    }
  }

  //if user has changed the option type after adding one or more options
  if (prevOptionType === "radio" && answerType !== "MCQ") {
    displayAlert(
      "alert-danger",
      "Answer Type can't be both the radio and the checkbox."
    );
    return true;
  }

  if (prevOptionType === "radio" && answerType !== "MCQ") {
    displayAlert(
      "alert-danger",
      "Answer Type can't be both the radio and the checkbox."
    );
    return true;
  }

  return false;
}

function handleAddOption() {
  const hasDuplicate = checkDuplicateOption(option.value);
  const hasError = checkAnswerType();

  if (hasError) return;

  if (hasDuplicate) {
    displayAlert("alert-danger", "Duplicate option!");
    option.value = "";
    return;
  }

  if (option.value === "") {
    displayAlert("alert-danger", "Option can't be empty.");
    return;
  }

  if (optionsContainer.children.length >= 5) {
    displayAlert("alert-danger", "You can't add more than 5 options.");
    return;
  }

  addOption(option.value);

  // reset option field value
  option.value = "";
}

addOptionButton?.addEventListener("click", handleAddOption);

addQuestionButton?.addEventListener("click", (e) => {
  // validate input
  const res = checkEmptyField();

  if (res.status === 204) {
    return;
  }

  // get the value of all the input fields
  const response = getQuestionData();

  if (response.status === 204) {
    displayAlert("alert-danger", response.message);
    return;
  }

  if (questionsContainer.children.length >= 10) {
    displayAlert("alert-danger", "You can't add more than 10 questions.");
    return;
  }

  addQuestion(response.quizData);
  questionsContainer.style.display = "block";
  displayAlert("alert-success", "Question added successfully.");

  // hide the alert after 3 seconds
  setTimeout(() => {
    hideAlert();
  }, 3000);

  resetInput();
});

discardButton?.addEventListener("click", () => {
  resetInput();
});

inputElements.forEach((input) => {
  input.addEventListener("focus", hideAlert);
});

createQuizButton?.addEventListener("click", () => {
  if (questionsContainer.children.length <= 0) {
    displayAlert(
      "alert-danger",
      "There must be at least one question to create quiz."
    );
    return;
  }

  const hasError = saveQuiz(questionsArray);

  if (hasError) return;

  // clear all the questions and quiz title
  questionsContainer.innerHTML = "";
  questionsContainer.style.display = "none";
  quizTitle.value = "";

  displayAlert("alert-success", "Quiz created successfully.");

  // hide the alert after 3 seconds
  setTimeout(() => {
    hideAlert();
  }, 3000);
});

window.addEventListener("DOMContentLoaded", () => {
  authoriseUser(messageEl, mainContainer, "admin");

  // hide the questions container
  if (questionsContainer) {
    questionsContainer.style.display = "none";
  }

  const quizArrayLength = JSON.parse(localStorage.getItem("quiz")).length;

  if (quizTitle) {
    quizTitle.value = `Quiz ${quizArrayLength + 1}`;
  }
});

optionsType.forEach((option) => {
  option.addEventListener("change", (e) => {
    answerType = option.value;
  });
});

optionForm?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleAddOption();
  }
});
