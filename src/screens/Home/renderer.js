const ipcRendererManager = require("../../utils/ipcRendererManager");
const shortcuts = require("./Tabs/shortcutsController");

// Function to fetch content from newContent.html
function fetchNewContent(pageName) {
  fetch(`./Tabs/${pageName}.html`)
    .then((response) => response.text())
    .then((html) => {
      const mainContainer = document.getElementById("main");
      mainContainer.innerHTML = html;

      if (pageName === "workspaces") {
        workspaces();
      } else if (pageName === "help") {
        help();
      } else if (pageName === "shortcuts") {
        shortcuts();
      } else {
        console.error("Page doesn't exist");
      }
    })
    .catch((error) => {
      console.error("Error fetching content:", error);
    });
}

function workspaces() {
  const button = document.getElementById("newButton");

  button.addEventListener("click", function () {
    ipcRendererManager.sendToMain("open-folder-dialog");
  });

  ipcRendererManager.listenToMain("selected-folder", (event, path) => {
    ipcRendererManager.showScreenWithData("index", { path: path });
  });
}

/* function separateStringIntoSpans(text) {
  const words = text.split(" ");
  const spans = words.map((word) => `<span>${word}</span> +`);
  return spans.join(" ").slice(0, -1);
}
 */
// TO-DO: write the questions ans answers in html
function help() {
  const questions = document.querySelectorAll(".question");

  questions.forEach((question) => {
    question.addEventListener("click", () => {
      const answer = question.nextElementSibling;
      answer.style.display =
        answer.style.display === "block" ? "none" : "block";
    });
  });
}

function main() {
  fetchNewContent("workspaces");
  document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll("#sidebar button");

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        buttons.forEach(function (btn) {
          btn.classList.remove("selected");
          button.classList.add("selected");

          const titleButton = button
            .querySelector(".title")
            .textContent.toLowerCase();
          fetchNewContent(titleButton);
        });
      });
    });
  });
}

main();
