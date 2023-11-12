const { ipcRenderer } = require("electron");

function submitInput() {
  const inputValue = document.getElementById("textInput").value;
  ipcRenderer.send("submit-input", inputValue);
}

function addEventListener(button) {
  button.addEventListener("click", () => {
    console.log("Clicked Submit");
    submitInput();
  });
}

function main() {
  console.log("FYNCTION");
  const submitButton = document.getElementById("submitButton");
  addEventListener(submitButton);
}

main();
