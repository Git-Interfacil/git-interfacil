/* eslint-disable no-unused-vars */

const {
  workspaces,
} = require("./Tabs/Workspaces/controllers/workspacesController");
const {
  shortcuts,
} = require("./Tabs/Shortcuts/controllers/shortcutsController");
const help = require("./Tabs/Help/controllers/helpController");

function changeTab(pageName) {
  const pages = document.querySelectorAll(".pageContent");
  pages.forEach((page) => {
    page.style.display = "none";
  });

  const selectedPage = document.getElementById(`${pageName}Page`);
  selectedPage.style.display = "flex";
  selectedPage.style.flexGrow = 1;
  selectedPage.style.flexDirection = "column";
}

function fetchNewContent(pageName) {
  fetch(`../screens/Home/Tabs/${pageName}.html`)
    .then((response) => response.text())
    .then((html) => {
      const container = document.getElementById(`${pageName}Page`);
      container.innerHTML = html;
      if (pageName !== "workspaces") {
        container.style.display = "none";
      } else {
        container.style.display = "flex";
        container.style.flexGrow = 1;
        container.style.flexDirection = "column";
      }

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
        changeTab(titleButton);
      });
    });
  });
};

function homeController() {
  fetchNewContent("shortcuts");
  fetchNewContent("help");
  fetchNewContent("workspaces");

  const buttons = document.querySelectorAll("#sidebar button");
  addEventListenerButtons(buttons);
}

module.exports = { homeController, fetchNewContent, addEventListenerButtons };
