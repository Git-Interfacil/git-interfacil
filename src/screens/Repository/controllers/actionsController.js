const Toast = require("../../../components/Toast/toast.js");
const ipcRendererManager = require("../../../utils/ipcRendererManager.js");

const sucessIcon = "../assets/sucess-icon.svg";
const errorIcon = "../assets/error-icon.svg";

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

async function add(repo, changedFiles = []) {
  try {
    if (changedFiles.length === 0) {
      await Toast.showToast("Error: add without files", errorIcon);
      ipcRendererManager.showErrorBox("No files selected");
      return;
    }
    if (changedFiles[0] === "") {
      await Toast.showToast("Error: add files not found", errorIcon);
      ipcRendererManager.showErrorBox("Files not found");
      return;
    }

    repo.add_files(changedFiles);
    Toast.showToast("Done: add", sucessIcon);
  } catch (error) {
    await Toast.showToast("Error: add", errorIcon);
    console.error("Add operation failed.", error);
  }
}

const actionButtonsHandlers = {
  pull: async (repo) => {
    try {
      await repo.pull();
      Toast.showToast("Done: pull", sucessIcon);
    } catch (error) {
      await Toast.showToast("Error: pull", errorIcon);
      console.error("Pull operation failed.", error);
    }
  },
  add: add,
  commit: async (repo, changedFiles) => {
    try {
      add(repo, changedFiles);
      const message = await openTextInputWindow();
      if (!message) {
        ipcRendererManager.showErrorBox("Message required");
        return;
      }
      repo.commit(message);
      await Toast.showToast("Done: commit", sucessIcon);
    } catch (error) {
      console.error("Error in commit operation:", error);
      await Toast.showToast("Error: commit", errorIcon);
      console.error("Commit operation failed.", error);
    }
  },
  push: async (repo, branch, remote = "origin") => {
    try {
      repo.push(remote, branch);
      await Toast.showToast("Done: push", sucessIcon);
    } catch (error) {
      await Toast.showToast("Error: push", errorIcon);
      console.error("Push operation failed.", error);
    }
  },
  stash: async (repo) => {
    try {
      await repo.stash();
      await Toast.showToast("Done: stash", sucessIcon);
    } catch (error) {
      await Toast.showToast("Error: stash", errorIcon);
      console.error("Stash operation failed.", error);
    }
  },
  pop: async (repo) => {
    try {
      await repo.pop_stash();
      await Toast.showToast("Done: pop", sucessIcon);
    } catch (error) {
      await Toast.showToast("Error: pop", errorIcon);
      console.error("Pop operation failed.", error);
    }
  },
};

module.exports = actionButtonsHandlers;
