const { ipcRenderer } = require("electron");

function openTextInputWindow() {
  ipcRenderer.send("open-text-input-window");
}

// ipcRenderer.on('text-input-value', (event, data) => {
//   const { inputValue } = data;
//   alert(`User entered: ${inputValue}`);
// });

const actionButtonsHandlers = {
  undo: () => {
    console.log("Undo button clicked");
    // #TO-DO: Add your code here for the Undo button action
  },
  redo: () => {
    console.log("Redo button clicked");
    // #TO-DO: Add your code here for the Redo button action
  },
  merge: () => {
    console.log("Merge button clicked");
    // #TO-DO: Add your code here for the Merge button action
  },
  pull: () => {
    console.log("Pull button clicked");
    // #TO-DO: Add your code here for the Pull button action
  },
  add: (repo, files) => {
    try {
      repo.add_files(files);
    } catch (error) {
      console.error("Error during add: ", error);
    }
  },
  commit: (repo, message) => {
    try {
      repo.commit(message);
    } catch (error) {
      console.error("Error during commit: ", error);
    }
  },
  push: (repo, branch, remote = "origin") => {
    console.log("Push button clicked");
    if (branch) {
      try {
        openTextInputWindow();
        const changedFiles = repo.get_changed_files();
        if (changedFiles[0] === "") {
          //   const options = {
          //     type: "question",
          //     buttons: ["Cancel", "Yes, please", "No, thanks"],
          //     defaultId: 2,
          //     title: "Question",
          //     message: "Do you want to do this?",
          //     detail: "It does not really matter",
          //     checkboxLabel: "Remember my answer",
          //     checkboxChecked: true,
          //   };

          ipcRenderer.invoke("showErrorBox", "No changes detected");
          return;
        }
        actionButtonsHandlers.add(repo, changedFiles);
        // return;
        const message = "testing push without await";
        actionButtonsHandlers.commit(repo, message);

        repo.push(remote, branch);
      } catch (error) {
        console.error("Error during push:", error);
      }
    } else {
      console.error("Unable to get the current branch.");
    }
  },
  branch: () => {
    console.log("Branch button clicked");
    // #TO-DO: Add your code here for the Branch button action
  },
  stash: () => {
    console.log("Stash button clicked");
    // #TO-DO: Add your code here for the Stash button action
  },
  pop: () => {
    console.log("Pop button clicked");
    // #TO-DO: Add your code here for the Pop button action
  },
};

module.exports = actionButtonsHandlers;
