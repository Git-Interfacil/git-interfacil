const Toast = require("./components/Toast/toast.js");
const ipcRendererManager = require("./utils/ipcRendererManager.js");

function openTextInputWindow() {
  return new Promise((resolve, reject) => {
    ipcRendererManager.openTextInputWindow();

    ipcRendererManager
      .waitForUpdatedInputValue()
      .then((inputValue) => {
        console.log("Received updated input value:", inputValue);
        resolve(inputValue);
      })
      .catch((err) => {
        console.error("Error while waiting for updated input value:", err);
        reject(err);
      });
  });
}

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
  add: async (repo) => {
    try {
      const changedFiles = await repo.get_changed_files();
      if (changedFiles[0] === "") {
        await Toast.showToast("Error: add", "./assets/error-icon.svg");
        ipcRendererManager.showErrorBox("No changes detected");
        return;
      }
      repo.add_files(changedFiles);
      Toast.showToast("Done: add", "./assets/sucess-icon.svg");
    } catch (error) {
      await Toast.showToast("Error: add", "./assets/error-icon.svg");
      throw new Error("Add operation failed.", error);
    }
  },
  commit: async (repo) => {
    try {
      const message = await openTextInputWindow();
      if (!message) {
        ipcRendererManager.showErrorBox("Message required");
        return;
      }
      repo.commit(message);
      await Toast.showToast("Done: commit", "./assets/sucess-icon.svg");
    } catch (error) {
      console.error("Error in commit operation:", error);
      await Toast.showToast("Error: commit", "./assets/error-icon.svg");
      throw new Error("Commit operation failed.", error);
    }
  },
  push: async (repo, branch, remote = "origin") => {
    try {
      repo.push(remote, branch);
      await Toast.showToast("Done: push", "./assets/sucess-icon.svg");
    } catch (error) {
      await Toast.showToast("Error: push", "./assets/error-icon.svg");
      throw new Error("Push operation failed.", error);
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
