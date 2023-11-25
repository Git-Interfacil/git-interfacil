/* eslint-disable no-undef */

const ipcRendererManager = require("../../../utils/ipcRendererManager");

function editShortcutHandler() {
  this.className = "edit";
  editShortcut(this.parentElement);
}

function saveNewShortcutHandler() {
  this.className = "save";
  saveNewShortcut(this.parentElement);
}

function editShortcut(row) {
  const inputsInRow = row.querySelectorAll("td input");
  inputsInRow.forEach((inputField) => {
    inputField.disabled = false;
  });

  const buttonIcon = row.cells[0];
  changeButton(buttonIcon);
}

function changeButton(button) {
  const icon = button.querySelector("img");
  if (button.className === "edit") {
    icon.src = "../../assets/save-icon.svg";
    button.removeEventListener("click", editShortcutHandler);
    button.addEventListener("click", saveNewShortcutHandler);
  } else if (button.className == "save") {
    icon.src = "../../assets/edit-icon.svg";
    button.removeEventListener("click", saveNewShortcutHandler);
    button.addEventListener("click", editShortcutHandler);
  } else {
    console.warn("class not found");
  }
}

function saveNewShortcut(newRow) {
  const inputsInNewRow = newRow.querySelectorAll("td input");
  inputsInNewRow.forEach((inputField) => {
    inputField.disabled = true;
  });

  const buttonIcon = newRow.cells[0];
  changeButton(buttonIcon);
}

function openNewShortcutWindow(keybindCell) {
  ipcRendererManager.openNewShortcutWindow();
  ipcRendererManager
    .waitForUpdatedInputValue()
    .then((inputValue) => {
      let span = keybindCell.querySelector("span");
      if (!span) {
        span = document.createElement("span");
        span.className = "keybind";
        keybindCell.appendChild(span);
      }
      const formattedText = separateStringIntoSpans(inputValue);
      span.innerHTML = formattedText;
    })
    .catch((err) => {
      console.error("Error while waiting for updated input value:", err);
    });
}

function addNewShortcut() {
  const table = document.getElementById("shortcutsTable");
  const newRow = document.createElement("tr");

  const iconCell = document.createElement("td");
  iconCell.className = "save";
  const icon = document.createElement("img");
  icon.src = "../../assets/save-icon.svg";
  iconCell.appendChild(icon);
  iconCell.addEventListener("click", function () {
    saveNewShortcut(newRow);
  });
  newRow.appendChild(iconCell);

  const commandCell = document.createElement("td");
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = `  Command name...`;
  commandCell.appendChild(input);
  newRow.appendChild(commandCell);

  const keybindCell = document.createElement("td");
  keybindCell.className = "keybind-container";
  const inputKeybind = document.createElement("input");
  inputKeybind.addEventListener("click", function () {
    openNewShortcutWindow(keybindCell);
  });
  keybindCell.appendChild(inputKeybind);
  newRow.appendChild(keybindCell);

  table.appendChild(newRow);
}

function separateStringIntoSpans(inputValue) {
  const words = inputValue.split(/\s+/).filter((word) => word !== "");

  if (inputValue === "" || words.length === 0) {
    ipcRendererManager.showErrorBox("Keybing required");
    return "";
  }

  const spans = words.map((word) => `<span>${word}</span>`);
  return spans.join(" + ");
}

function shortcuts(document) {
  const editButtons = document.querySelectorAll("td img");
  editButtons.forEach((button) => {
    button.addEventListener("click", editShortcutHandler);
  });

  const createNew = document.getElementById("newButton");
  createNew.addEventListener("click", function () {
    addNewShortcut();
  });
}

module.exports = {
  shortcuts,
  separateStringIntoSpans,
  openNewShortcutWindow,
  saveNewShortcut,
  changeButton,
  editShortcut,
};
