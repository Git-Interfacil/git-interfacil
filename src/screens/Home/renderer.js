/* eslint-disable no-unused-vars */

const { workspaces } = require("./Tabs/Workspaces/workspacesController");
const { shortcuts } = require("./Tabs/Shortcuts/shortcutsController");
const help = require("./Tabs/Help/helpController");

function fetchNewContent(pageName) {
  fetch(`./Home/Tabs/${pageName}.html`)
    .then((response) => response.text())
    .then((html) => {
      const mainContainer = document.getElementById("main");
      mainContainer.innerHTML = html;

      if (pageName === "workspaces") {
        workspaces();
      } else if (pageName === "help") {
        const questions = document.querySelectorAll(".question");
        help(questions);
      } else if (pageName === "shortcuts") {
        shortcuts(document);
      } else {
        console.error("Page doesn't exist");
      }
    })
    .catch((error) => {
      console.error("Error fetching content:", error);
    });
}

const addEventListenerButtons = (buttons) => {
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
};

function homeController() {
  console.log("HomeController");
  fetchNewContent("workspaces");
  const buttons = document.querySelectorAll("#sidebar button");
  addEventListenerButtons(buttons);
}

homeController();

module.exports = { homeController, fetchNewContent, addEventListenerButtons };
