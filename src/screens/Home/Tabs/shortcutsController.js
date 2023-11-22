/* eslint-disable no-undef */

// Define event handler functions
function editShortcutHandler() {
  this.class = "edit";
  editShortcut(this.parentElement);
}

function saveNewShortcutHandler() {
  this.class = "save";
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
  if (button.class === "edit") {
    icon.src = "../../assets/save-icon.svg";
    button.removeEventListener("click", editShortcutHandler);
    button.addEventListener("click", saveNewShortcutHandler);
  } else if (button.class == "save") {
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
    saveField(inputField);
  });

  const buttonIcon = newRow.cells[0];
  changeButton(buttonIcon);
}

function saveField(inputElement) {
  const value = inputElement.value;
  console.log(value);
}

function getInputValue(input) {
  console.log("Input: ", input);
  const table = document.getElementById("shortcutsTable");
  table.addEventListener("input", function (event) {
    const target = event.target;
    console.log("target: ", target);
  });

  table.addEventListener("keypress", function (event) {
    const target = event.target;
    if (event.key === "Enter") {
      saveField(target);
    }
  });

  table.addEventListener("blur", function (event) {
    const target = event.target;

    if (target.tagName === "INPUT") {
      saveField(target);
    }
  });
}

function addNewShortcut() {
  const table = document.getElementById("shortcutsTable");
  console.log("create new shortcut", table);
  const newRow = document.createElement("tr");

  const iconCell = document.createElement("td");
  iconCell.class = "save";
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
  const inputKeybind = document.createElement("input");
  inputKeybind.onclick = ipcRendererManager.openNewShortcutWindow;
  keybindCell.appendChild(inputKeybind);
  newRow.appendChild(keybindCell);

  table.appendChild(newRow);
  getInputValue(input);
}

function shortcuts() {
  const keybindElements = document.querySelectorAll(".keybind");

  keybindElements.forEach((element) => {
    const text = element.textContent.trim();
    const formattedText = separateStringIntoSpans(text);
    element.innerHTML = formattedText;
  });

  const editButtons = document.querySelectorAll("td img");
  editButtons.forEach((button) => {
    button.addEventListener("click", editShortcutHandler);
  });

  const createNew = document.getElementById("newButton");

  createNew.addEventListener("click", function () {
    addNewShortcut();
  });
}

module.exports = shortcuts;
