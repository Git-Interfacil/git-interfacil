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

  fillMessages(commits) {
    commits.forEach(({ message, author, color }) => {
      const messageElement = messagesController.createMessage(
        message,
        author,
        color,
      );
      this.#messagesElement.appendChild(messageElement);
    });
  }

  getMessagesElement() {
    return this.#messagesElement;
  }

  getLocalBranchesElement() {
    return this.#localBranchesElement;
  }

  getCountLocalBranchesElement() {
    return this.#countLocalBranchesElement;
  }

  getChangedFilesElement() {
    return this.#changedFilesElement;
  }

  getCountChangedFilesElement() {
    return this.#countChangedFilesElement;
  }
}

module.exports = RendererElements;
