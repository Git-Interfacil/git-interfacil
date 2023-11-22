// const ipcRendererManager = require("../../utils/ipcRendererManager");

function getKeypress(event) {
  let key = event.key;
  document.getElementById("demo").innerHTML = "The key was: " + key;

  if (key === "Enter") {
    return null;
  }

  return key;
}

function getKeybind(event) {
  let keys = "";
  let key;
  while ((key = getKeypress(event))) {
    keys = keys.concat(key);
  }
  console.log(keys);
}

function addEventListener(button) {
  button.addEventListener("click", () => {
    console.log("submit");
  });
}

function main() {
  const submitButton = document.getElementById("submitButton");
  addEventListener(submitButton);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      getKeybind(event);
    } else {
      document.removeEventListener("keydown");
    }
  });
}

main();
