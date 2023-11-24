/* eslint-disable no-unused-vars */

const { workspaces } = require("./Tabs/workspacesController");
const { shortcuts } = require("./Tabs/shortcutsController");
const help = require("./Tabs/helpController");

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
  fetchNewContent("workspaces");
  document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll("#sidebar button");
    addEventListenerButtons(buttons);
  });
}

homeController();

module.exports = { fetchNewContent, addEventListenerButtons };
