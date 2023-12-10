const localBranchesController = require("./controllers/localBranchesController");
const changedFilesController = require("./controllers/changedFilesController");
const messagesController = require("./controllers/messagesController");

class RendererElements {
  #messagesElement;
  #localBranchesElement;
  #countLocalBranchesElement;
  #changedFilesElement;
  #countChangedFilesElement;

  constructor(
    messages,
    localBranches,
    countLocalBranches,
    changedFiles,
    countChangedFiles,
  ) {
    this.#messagesElement = messages;
    this.#localBranchesElement = localBranches;
    this.#countLocalBranchesElement = countLocalBranches;
    this.#changedFilesElement = changedFiles;
    this.#countChangedFilesElement = countChangedFiles;
  }

  clearLocalBranches() {
    this.#localBranchesElement.innerHTML = "";
  }

  fillLocalBranches(branches) {
    localBranchesController.setCount(
      this.#countLocalBranchesElement,
      branches.length,
      branches.length,
    );

    branches.forEach((branch) => {
      const branchElement = localBranchesController.createBranch(branch);
      this.#localBranchesElement.appendChild(branchElement);
    });
  }

  clearChangedFiles() {
    this.#changedFilesElement.innerHTML = "";
  }

  fillChangedFiles(changedFiles) {
    changedFilesController.setCount(
      this.#countChangedFilesElement,
      changedFiles.length,
      changedFiles.length,
    );

    changedFiles.forEach((changedFile, index) => {
      const changedFileElement = changedFilesController.createChangedFile(
        changedFile,
        index,
      );
      this.#changedFilesElement.appendChild(changedFileElement);
    });
  }

  clearMessages() {
    this.#messagesElement.innerHTML = "";
  }

  fillMessages(commits, branches) {
    commits.forEach(({ message, branchId, author }) => {
      const parentBranch = branches.find(({ id }) => id === branchId);
      const messageElement = messagesController.createMessage(
        message,
        author,
        parentBranch.color,
      );
      this.#messagesElement.appendChild(messageElement);
    });
  }
}

module.exports = RendererElements;
