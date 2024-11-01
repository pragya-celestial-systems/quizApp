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
  optionType,
  questionIndex,
  isEditing = false
) {
  const type = optionType === "MCQ" ? "radio" : "checkbox";
  let options = "";

  optionsArray.forEach((option, index) => {
    const optionHtml = !isEditing
      ? `<div class="option">${option}<div/>`
      : `<input type="${type}" name="question-${questionIndex}" value="${option}"/> ${option}`;

    options += `
      <div class="option">
        ${optionHtml}
      </div>
      `;
  });

  return options;
}

export function saveSubmittedData(quizData, inputContainer) {
  const answers = quizData.questions.map((question, index) => {
    // Array.from - it will convert the nodelist into an array
    let selectedOptions = Array.from(
      inputContainer.querySelectorAll(`input[name="question-${index}"]:checked`)
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
