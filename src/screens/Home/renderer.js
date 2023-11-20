const ipcRendererManager = require("../../utils/ipcRendererManager");

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
    ipcRendererManager.sendToMain("open-folder-dialog");
  });

  ipcRendererManager.listenToMain("selected-folder", (event, path) => {
    ipcRendererManager.showScreenWithData("index", { path: path });
  });
}

main();
