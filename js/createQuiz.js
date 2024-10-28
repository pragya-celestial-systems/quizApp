// TODO : quiz title must not be cleared when we add question
const addQuestionButton = document.querySelector("#addQuestionButton");
const quizTitle = document.querySelector("#quizTitle");
const question = document.querySelector("#question");
const option = document.querySelector("#option");
const addOptionButton = document.querySelector("#addOptionButton");
const optionsContainer = document.querySelector("#optionsContainer");
const questionsContainer = document.querySelector("#questionsContainer");
const discardButton = document.querySelector("#discardButton");
const alertBox = document.querySelector("#alertBox");
const inputElements = document.querySelectorAll("input");
const createQuizButton = document.querySelector("#createQuizButton");

export function renderForm() {
  window.open("../pages/form.html", "_self");
}

function getCorrectAnswer() {
  return Array.from(optionsContainer.children).filter(
    (option) => option.checked
  );
}

function resetInput() {
  const answerType = document.querySelector(".answer-type:checked");

  quizTitle.value = "Quiz 1";
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
  <input type="${optionType}" name="option" value="${option}"/> ${option}
  `;

  optionsContainer.insertAdjacentHTML("afterbegin", optionHtml);
}

function getOptions() {
  const options = Array.from(optionsContainer.children);

  // Array.from(nodelist) will convert the nodelist into an array
  return options.map((option) => option.value);
}

function checkEmptyField() {
  const answerType = document.querySelector(".answer-type:checked");

  if (quizTitle.value === "") {
    displayAlert("alert-danger", "Please fill the quiz title.");
    // alert("Please fill the quiz title.");
    return;
  } else if (question.value === "") {
    displayAlert("alert-danger", "Please enter the question.");
    // alert("Please enter the question.");
    return;
  } else if (answerType === null) {
    displayAlert("alert-danger", "Please select the answer type.");
    // alert("Please select the answer type.");
    return;
  } else if (optionsContainer.children.length < 2) {
    displayAlert("alert-danger", "Please add at least 2 options.");
    // alert("Please add at least two options.");
    return;
  }
}

function saveQuiz(quiz) {
  const quizObj = {
    title: quizTitle.value,
    questions: getAllQuestions(),
  };

  const quizArray = JSON.parse(localStorage.getItem("quiz")) || [];
  quizArray.push(quizObj);

  // save the updated array in the local storage
  localStorage.setItem("quiz", JSON.stringify(quizArray));
}

function getAllQuestions() {
  let questions =
    questionsContainer.children.length < 0
      ? []
      : Array.from(questionsContainer?.children);
  let questionsArray = [];

  questions.forEach((qus) => {
    const question = qus.firstElementChild.textContent.split(":")[1];
    questionsArray.push(question);
  });

  return questionsArray;
}

function getQuestionData() {
  const answerType = document.querySelector(".answer-type:checked").value;
  let correctAnswer = getCorrectAnswer();

  if (!correctAnswer || correctAnswer.length <= 0) {
    return {
      status: 204,
      message: "Please select the correct answer for the question.",
    };
  }

  // if the answer type is MCQ
  if (answerType === "MCQ") {
    correctAnswer = correctAnswer[0].defaultValue;
  } else {
    correctAnswer = correctAnswer.map((ans) => ans.defaultValue);
  }

  const quizData = {
    question: question.value,
    options: getOptions(),
    answerType,
    correctAnswer,
  };

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
  questionsContainer.insertAdjacentHTML("beforeend", questionHtml);
}

addOptionButton.addEventListener("click", () => {
  if (option.value === "") {
    displayAlert("alert-danger", "Option can't be empty.");
    // alert("option can't be empty");
    return;
  }

  if (optionsContainer.children.length < 5) {
    addOption(option.value);
  }

  // reset option field value
  option.value = "";
});

addQuestionButton.addEventListener("click", (e) => {
  // validate input
  checkEmptyField();

  // get the value of all the input fields
  const response = getQuestionData();

  if (response.status === 204) {
    // alert(response.message);
    displayAlert("alert-danger", response.message);
    return;
  }

  if (questionsContainer.children.length >= 10) {
    displayAlert("alert-danger", "You can't add more than 10 questions.");
    // alert("You can't add more than 10 questions.");
    return;
  }

  addQuestion(response.quizData);
  displayAlert("alert-success", "Question added successfully.");

  // hide the alert after 3 seconds
  setTimeout(() => {
    hideAlert();
  }, 3000);

  resetInput();
});

discardButton.addEventListener("click", () => {
  resetInput();
});

window.addEventListener("DOMContentLoaded", () => {
  question.value = "what is html?";
  document.querySelector(".answer-type").checked = true;
  option.value = "option 1";
});

inputElements.forEach((input) => {
  input.addEventListener("focus", hideAlert);
});

createQuizButton.addEventListener("click", () => {
  if (questionsContainer.children.length <= 0) {
    displayAlert(
      "alert-danger",
      "There must be at least one question to create quiz."
    );
    return;
  }
  getAllQuestions();
  saveQuiz();

  // clear all the questions
  questionsContainer.innerHTML = "";

  displayAlert("alert-success", "Quiz created successfully.");

  // hide the alert after 3 seconds
  setTimeout(() => {
    hideAlert();
  }, 3000);
});
