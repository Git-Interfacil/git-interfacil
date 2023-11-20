const ipcRendererManager = require("../../utils/ipcRendererManager");

// Function to fetch content from newContent.html
function fetchNewContent(pageName) {
  fetch(`${pageName}.html`) // Fetch the content from the HTML file
    .then((response) => response.text()) // Convert response to text
    .then((html) => {
      // Replace content inside the main container with the fetched HTML
      const mainContainer = document.getElementById("main");
      mainContainer.innerHTML = html;

      if (pageName === "workspaces") {
        workspaces();
      } else if (pageName === "help") {
        help();
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

    // TO-DO: add changing screen function
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
