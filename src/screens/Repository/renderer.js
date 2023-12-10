/* eslint-disable no-undef */
const constants = require("./constants.js");
const git_module = require("./git.js");
const RepoSelector = require("./RepoSelector.js");
const CanvasController = require("./controllers/canvasController.js");
const messagesController = require("./controllers/messagesController.js");
const localBranchesController = require("./controllers/localBranchesController.js");
const animationsController = require("./controllers/animationsController.js");
const actionButtonHandlers = require("./controllers/actionsController.js");

class RepositoryRenderer {
  constructor(commits, head, canvasController, messagesElement) {
    this.head = head;
    this.commits = commits;
    this.sortCommits();
    this.branches = this.generateAllBranches();

    this.messagesElement = messagesElement;

    this.activeBranches = this.branches.map(({ id }) => id);
    this.canvasController = canvasController;

    this.setCanvasSize();
  }

  sortCommits() {
    this.commits.sort(
      (a, b) =>
        new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
    );
  }

  setCanvasSize() {
    const filteredCommits = this.commits.filter(({ branchId }) =>
      this.activeBranches.includes(branchId),
    );

    const width = constants.COLUMN_WIDTH * (this.activeBranches.length + 1);
    const height = constants.LINE_HEIGHT * (filteredCommits.length + 1);
    this.canvasController.setDimensions(width, height);
  }

  generateAllBranches() {
    const branches = [];
    this.commits.forEach(({ branchId }, ind) => {
      let branch = branches.find(({ id }) => id === branchId);
      if (!branch) {
        branch = {
          id: branchId,
          pos: {
            x: (branches.length + 1) * constants.COLUMN_WIDTH,
            y: (ind + 1) * constants.LINE_HEIGHT,
          },
          color: constants.COLORS[branches.length],
        };
        branches.push(branch);
      }
    });
    return branches;
  }

  repositionBranches() {
    const filteredCommits = this.commits.filter(({ branchId }) =>
      this.activeBranches.includes(branchId),
    );

    filteredCommits.forEach(({ branchId }, ind) => {
      const branch = this.branches.find(({ id }) => id === branchId);
      branch.pos.y = (ind + 1) * constants.LINE_HEIGHT;
    });

    let ind = 0;
    this.branches.forEach((branch) => {
      if (this.activeBranches.includes(branch.id)) {
        branch.pos.x = (ind + 1) * constants.COLUMN_WIDTH;
        ind++;
      }
    });

    this.setCanvasSize();
  }

  drawBranches() {
    this.canvasController.clearCanvas();
    this.repositionBranches();
    const filteredCommits = this.commits.filter(({ branchId }) =>
      this.activeBranches.includes(branchId),
    );

    const commitsPos = this.calculateCommitsPositions(filteredCommits);
    this.drawConnections(commitsPos);
    commitsPos.forEach((commit) => {
      const parentBranch = this.branches.find(
        ({ id }) => id === commit.branchId,
      );
      this.canvasController.drawCommit(
        commit.pos,
        parentBranch.color,
        this.head == commit.id,
      );
    });
  }

  calculateCommitsPositions(filteredCommits) {
    const commitsWithPositions = [];
    filteredCommits.forEach((commit, ind) => {
      const parentBranch = this.branches.find(
        ({ id }) => id === commit.branchId,
      );

      const pos = {
        x: parentBranch.pos.x,
        y: (ind + 1) * constants.LINE_HEIGHT,
      };

      const newCommit = { ...commit, pos };
      commitsWithPositions.push(newCommit);
    });
    return commitsWithPositions;
  }

  drawConnections(commits) {
    commits.forEach((commit) => {
      commit.parents.forEach((parent) => {
        const parentCommit = commits.find(({ id }) => parent.startsWith(id));

        if (parentCommit) {
          const parentBranch = this.branches.find(
            ({ id }) => id === parentCommit.branchId,
          );

          this.canvasController.drawBezierCurve(
            commit.pos,
            parentCommit.pos,
            10,
            parentBranch.color,
          );
        }
      });
    });
  }

  clearMessages() {
    this.messagesElement.innerHTML = "";
  }

  fillMessages() {
    this.clearMessages();
    const filteredCommits = this.commits.filter(({ branchId }) =>
      this.activeBranches.includes(branchId),
    );

    filteredCommits.forEach(({ message, branchId, author }) => {
      const parentBranch = this.branches.find(({ id }) => id === branchId);
      const messageElement = messagesController.createMessage(
        message,
        author,
        parentBranch.color,
      );
      this.messagesElement.appendChild(messageElement);
    });
  }

  activateBranch(branchId) {
    this.activeBranches.push(branchId);
  }

  deactivateBranch(branchId) {
    this.activeBranches = this.activeBranches.filter((id) => id !== branchId);
  }
}

function addEventListenerToActionsBar(
  buttons,
  actionButtonHandlers,
  repo,
  currentBranchId,
) {
  const buttonParams = {
    add: { repo },
    commit: { repo },
    push: { repo, currentBranchId },
    undo: {},
    redo: {},
  };
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("Clicked");
      const buttonText = button.innerText;

      if (buttonText in actionButtonHandlers) {
        actionButtonHandlers[buttonText](
          ...Object.values(buttonParams[buttonText]),
        );
      } else {
        console.log("Button not found");
      }
    });
  });
}

function fillLocalBranches(list, count, branches) {
  localBranchesController.setCount(count, branches.length, branches.length);

  branches.forEach((branch) => {
    const branchElement = localBranchesController.createBranch(branch);
    list.appendChild(branchElement);
  });
}

function fillChangedFiles(changedFiles, changedFilesList) {
  for (let i = 0; i < changedFiles.length; i++) {
    const changedFileElement = document.createElement("li");
    changedFileElement.dataset.changedId = changedFiles[i];
    const id = "changed-" + changedFiles[i];

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = false;
    checkbox.id = id;

    const label = document.createElement("label");
    label.htmlFor = id;
    label.appendChild(document.createTextNode(changedFiles[i]));
    label.classList.add("active");

    changedFileElement.appendChild(checkbox);
    changedFileElement.appendChild(label);

    changedFilesList.appendChild(changedFileElement);
  }
}

function addListenersToSidebar(dropdowns) {
  dropdowns.forEach((dropdown) => {
    const header = dropdown.querySelector(".header");
    const submenu = dropdown.querySelector(".items");
    animationsController.slideDown(submenu);
    header.addEventListener("click", () => {
      animationsController.slideToggle(submenu);

      if (submenu.classList.contains("opened")) {
        setTimeout(() => {
          header.classList.toggle("opened");
        }, 300);
      } else {
        header.classList.toggle("opened");
      }

      submenu.classList.toggle("opened");
    });
  });
}

function addListenersToLocalBranchesCheckboxes(
  list,
  counter,
  repositoryRenderer,
) {
  list.forEach((item) => {
    const checkbox = item.querySelector("input");
    const branchId = item.dataset.branchId;

    checkbox.addEventListener("change", () => {
      if (!checkbox.checked) {
        localBranchesController.deactivateBranch(item);
        localBranchesController.decreaseCount(counter);

        repositoryRenderer.deactivateBranch(branchId);
        repositoryRenderer.drawBranches();
        repositoryRenderer.fillMessages();
      } else {
        localBranchesController.activateBranch(item);
        localBranchesController.increaseCount(counter);

        repositoryRenderer.activateBranch(branchId);
        repositoryRenderer.drawBranches();
        repositoryRenderer.fillMessages();
      }
    });
  });
}

function loadRepoClient(repo) {
  const commits = repo.get_commit_info();
  const changedFiles = repo.get_changed_and_untracked_files();
  const head = repo.get_repo_head();

  const headCommit = commits.find((commit) => head.startsWith(commit.id));
  const currentBranchId = headCommit ? headCommit.branchId : null;

  const canvas = document.querySelector("canvas");
  const canvasController = new CanvasController(canvas);

  const messages = document.getElementById("messages");

  const repositoryRenderer = new RepositoryRenderer(
    commits,
    head,
    canvasController,
    messages,
  );

  const branches = repositoryRenderer.branches;

  const buttonActions = document.querySelectorAll(".button");
  addEventListenerToActionsBar(
    buttonActions,
    actionButtonHandlers,
    repo,
    currentBranchId,
  );

  const sidebar = document.getElementById("sidebar");
  const localBranches = document.getElementById("localList");
  const localBranchesCount = document.getElementById("localCount");

  fillLocalBranches(localBranches, localBranchesCount, branches);
  repositoryRenderer.drawBranches();
  repositoryRenderer.fillMessages(messages);

  const sidebarDropdowns = sidebar.querySelectorAll(".dropdown");
  const localBranchesList = localBranches.querySelectorAll("li");

  const changedFilesList = document.getElementById("changedList");
  const changedFilesCount = document.getElementById("changedCount");
  changedFilesCount.innerHTML = "0" + "/" + changedFiles.length;
  fillChangedFiles(changedFiles, changedFilesList);

  addListenersToSidebar(sidebarDropdowns);
  addListenersToLocalBranchesCheckboxes(
    localBranchesList,
    localBranchesCount,
    repositoryRenderer,
  );
}

function handleStoreWindowArgs(path) {
  const initialRepo = new git_module.Repository(path);
  loadRepoClient(initialRepo);
  const commits = initialRepo.get_commit_info();
  const head = initialRepo.get_repo_head();
  const headCommit = commits.find((commit) => head.startsWith(commit.id));
  const currentBranchId = headCommit ? headCommit.branchId : null;
  main();
  return { repo: initialRepo, currentBranchId: currentBranchId };
}

function main() {
  const repoSelector = new RepoSelector();

  document.getElementById("repoSelector").addEventListener("change", () => {
    const repo = new git_module.Repository(repoSelector.getDirPath());
    loadRepoClient(repo);
  });
}

module.exports = { main, handleStoreWindowArgs };
