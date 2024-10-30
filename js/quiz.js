const form = document.querySelector("#test");
const quizTitle = document.querySelector("#quizTitle");

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

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const quizData = getQuizData();
  const answers = quizData.questions.map((question, index) => {
    // Array.from - it will convert the nodelist into an array
    let selectedOptions = Array.from(
      form.querySelectorAll(`input[name="question-${index}"]:checked`)
    ).map((input) => input.value.split("\n")[1].trim());

    if (question.answerType === "MCQ") {
      selectedOptions = selectedOptions[0];
    }

    return {
      question: question.question,
      selectedOptions: selectedOptions,
      answerType: question.answerType,
    };
  });

  // save answers in the session storage
  sessionStorage.setItem("answers", JSON.stringify(answers));
});

window.addEventListener("DOMContentLoaded", () => {
  const quizData = getQuizData();

  // Set the quiz title
  quizTitle.textContent = quizData.title;

  renderQuestions(quizData.questions);
});

window.addEventListener("load", () => {
  // clear the stored answers
  sessionStorage.removeItem("answers");
});
