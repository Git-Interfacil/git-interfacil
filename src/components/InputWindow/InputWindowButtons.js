const { ipcRenderer } = require("electron");

function submitInput() {
  const inputValue = document.getElementById("textInput").value;
  ipcRenderer.send("submit-input", inputValue);
}

function addEventListener(button) {
  button.addEventListener("click", () => {
    submitInput();
  });
}

function main() {
  const submitButton = document.getElementById("submitButton");
  addEventListener(submitButton);
}

main();
