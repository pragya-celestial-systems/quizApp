const addQuestionButton = document.querySelector("#addQuestionButton");
const quizTitle = document.querySelector("#quizTitle");
const question = document.querySelector("#question");
const option = document.querySelector("#option");
const addOptionButton = document.querySelector("#addOptionButton");
const optionsContainer = document.querySelector("#optionsContainer");
const questionsContainer = document.querySelector("#questionsContainer");
const discardButton = document.querySelector("#discardButton");
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

function addOption(option, optionType) {
  const answerType = document.querySelector(".answer-type:checked").value;
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
    alert("Please fill the quiz title.");
    return;
  } else if (question.value === "") {
    alert("Please enter the question.");
    return;
  } else if (answerType === null) {
    alert("Please select the answer type.");
    return;
  } else if (optionsContainer.children.length < 2) {
    alert("Please add at least two options.");
    return;
  }
}

function saveQuiz(quiz) {
  const quizArray = JSON.parse(localStorage.getItem("quiz")) || [];
  quizArray.push(quiz);

  // save the updated array in the local storage
  localStorage.setItem("quiz", JSON.stringify(quizArray));
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

  questionData.options.map((option, index) => console.log(option, index));

  console.log(questionData.options);

  const correctAnswerHtml = Array.isArray(questionData.correctAnswer)
    ? questionData.correctAnswer.join(", ")
    : questionData.correctAnswer;

  // Create the full HTML for the question
  const questionHtml = `
    <div class="questionBox">
      <p class="question">Qus : <b>${questionData.question}</b></p>
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
    alert("option can't be empty");
    return;
  }

  if (optionsContainer.children.length < 5) {
    addOption(option.value);
  }

  // reset option field value
  option.value = "";
});

addQuestionButton.addEventListener("click", (e) => {
  // add validation
  checkEmptyField();

  // get the value of all the input fields
  const response = getQuestionData();

  if (response.status === 204) {
    alert(response.message);
    return;
  }

  // create question
  addQuestion(response.quizData);

  // save the obj in local storage
  // display all the questions and their correct answer in the below container
});

discardButton.addEventListener("click", () => {
  resetInput();
});

window.addEventListener("DOMContentLoaded", () => {
  question.value = "what is html?";
  document.querySelector(".answer-type").checked = true;
  option.value = "option 1";
});
