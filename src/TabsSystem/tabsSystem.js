/* eslint-disable no-undef */
const { selectTab, closeTab } = require("./tabsSystemController");

function createNewTab(tabName, iconSrc = "../assets/repository-icon.svg") {
  const navigation = document.getElementById("navigation");
  const button = document.createElement("button");
  button.setAttribute("id", tabName);
  button.classList.add("tablinks");

  const icon = document.createElement("img");
  icon.classList.add("iconTab");
  icon.src = iconSrc;

  const span = document.createElement("span");
  span.classList.add("tabName");
  span.textContent = tabName;

  const closeDiv = document.createElement("div");
  closeDiv.classList.add("close");

  const closeIcon = document.createElement("img");
  closeIcon.src = "../assets/X.svg";

  closeDiv.appendChild(closeIcon);
  button.appendChild(icon);
  button.appendChild(span);
  button.appendChild(closeDiv);
  navigation.appendChild(button);

  closeDiv.addEventListener("click", (event) => {
    navigation.removeChild(button);
    closeTab(closeDiv.parentElement);
    event.stopPropagation();
  });

  button.addEventListener("click", () => {
    selectTab(`../screens/Repository/index.html`, tabName);
  });
}

function tabsSystem() {
  selectTab(`../screens/Home`, "Home");

  const closeButtons = document.querySelectorAll(".close");
  closeButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      closeTab(button.parentElement);
      event.stopPropagation();
    });
  });

  const tabLinks = document.querySelectorAll(".tablinks");
  tabLinks.forEach((tab) => {
    tab.addEventListener("click", function () {
      selectTab(`../screens/${tab.id}`, tab.id);
    });
  });
}

tabsSystem();

module.exports = { tabsSystem, createNewTab };
