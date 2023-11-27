const ipcRendererManager = require("../../utils/ipcRendererManager");

let keysPressed = [];
let lastKeyPressTime = null;

function getKeypress(event) {
  const key = event.key;
  const currentTime = new Date().getTime();

  if (key === "Enter" && keysPressed.length > 0) {
    const combination = keysPressed.join(" ");
    saveKeybind(combination);
    keysPressed = [];
  } else if (key !== "Enter") {
    if (lastKeyPressTime && currentTime - lastKeyPressTime > 100) {
      keysPressed = [];
    }
    keysPressed.push(key);
    lastKeyPressTime = currentTime;
  }
  document.getElementById("demo").innerHTML = "The key was: " + keysPressed;
}

function saveKeybind(keybind) {
  console.log("Saved combination:", keybind);
  ipcRendererManager.submitInput(keybind);
  window.close();
}

function newShortcut() {
  document.addEventListener("keydown", getKeypress);
  document.addEventListener("keyup", getKeypress);
}

newShortcut();
