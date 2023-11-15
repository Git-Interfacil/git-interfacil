const { ipcRenderer } = require("electron");
// const git_module = require("./git.js");

function main() {
  document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll("#sidebar button");

    // TO-DO: add changing screen function
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        if (button.classList.contains("selected")) {
          button.classList.remove("selected");
        } else {
          buttons.forEach(function (btn) {
            btn.classList.remove("selected");
            button.classList.add("selected");
          });
        }
      });
    });
  });

  const button = document.getElementById("newWorkspaceButton");

  button.addEventListener("click", function () {
    ipcRenderer.send("open-folder-dialog");
  });

  ipcRenderer.on("selected-folder", (event, path) => {
    ipcRenderer.send("show-screen", "index");
    ipcRenderer.send("update-folder", path);
  });
}

main();
