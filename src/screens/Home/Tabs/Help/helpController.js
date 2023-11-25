// TO-DO: write the questions ans answers in html
function help(questions) {
  questions.forEach((question) => {
    question.addEventListener("click", () => {
      const answer = question.nextElementSibling;
      answer.style.display =
        answer.style.display === "block" ? "none" : "block";
    });
  });
}

module.exports = help;
