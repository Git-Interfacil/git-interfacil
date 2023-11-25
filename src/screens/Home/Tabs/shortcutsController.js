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

async function generateShortcutsFromJSON(fileName) {
  try {
    const response = await fetch(`${fileName}.json`);
    const shortcutsData = await response.json();

    const table = document.getElementById("shortcutsTable");

    shortcutsData.forEach((item) => {
      const row = table.insertRow();
      const editCell = row.insertCell();
      editCell.classList.add("edit");
      editCell.innerHTML = '<img src="../../assets/edit-icon.svg" />';

      const actionCell = row.insertCell();
      actionCell.classList.add("command");
      actionCell.textContent = item.action;

      const keybindCell = row.insertCell();
      keybindCell.classList.add("keybind-container");
      const input = document.createElement("input");
      input.setAttribute("type", "text");
      input.setAttribute("disabled", "true");

      const keybindSpan = document.createElement("span");
      keybindSpan.classList.add("keybind");
      const keyCombination = item.keyCombination;
      keybindSpan.innerHTML = separateStringIntoSpans(keyCombination);

      keybindCell.appendChild(input);
      keybindCell.appendChild(keybindSpan);
    });
  } catch (error) {
    console.error("Error fetching or parsing JSON: ", error);
  }
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

async function shortcuts(document) {
  await generateShortcutsFromJSON("./Tabs/shortcutsData");

  const editButtons = document.querySelectorAll(".edit");
  editButtons.forEach((button) => {
    button.addEventListener("click", editShortcutHandler);
  });

  const inputKeybinds = document.querySelectorAll("input");
  inputKeybinds.forEach((input) => {
    input.addEventListener("click", function () {
      openNewShortcutWindow(input.parentElement);
    });
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
