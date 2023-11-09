const constants = require("./constants.js");
const git_module = require("./git.js");
const canvasController = require("./canvasController.js");
const messagesController = require("./messagesController.js");
const localBranchesController = require("./localBranchesController.js");
const animationsController = require("./animationsController.js");
const actionButtonHandlers = require("./actionsController.js");

class RepositoryRenderer {
  constructor(commits, head, canvas, ctx, messagesElement) {
    this.head = head;
    this.commits = commits;
    this.sortCommits();
    this.branches = this.generateAllBranches();

    this.canvas = canvas;
    this.ctx = ctx;

    this.messagesElement = messagesElement;

    this.activeBranches = this.branches.map(({ id }) => id);

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

    this.canvas.width =
      constants.COLUMN_WIDTH * (this.activeBranches.length + 1);
    this.canvas.height = constants.LINE_HEIGHT * (filteredCommits.length + 1);
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

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBranches() {
    this.clearCanvas();
    this.repositionBranches();
    const filteredCommits = this.commits.filter(({ branchId }) =>
      this.activeBranches.includes(branchId),
    );

    const commitsWithPos = filteredCommits.map((commit, ind) => {
      const parentBranch = this.branches.find(
        ({ id }) => id === commit.branchId,
      );

      const pos = {
        x: parentBranch.pos.x,
        y: (ind + 1) * constants.LINE_HEIGHT,
      };

      if (this.head == commit.id)
        canvasController.drawCommit(this.ctx, pos, parentBranch.color, 8, true);
      else canvasController.drawCommit(this.ctx, pos, parentBranch.color);

      canvasController.drawLine(
        this.ctx,
        pos,
        parentBranch.pos,
        parentBranch.color,
      );
      return { ...commit, pos };
    });

    this.canvas.addEventListener("click", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = event.x - rect.left;
      const y = event.y - rect.top;
      const commitClicked = commitsWithPos.find(
        ({ pos: commitPosition }) =>
          x >= commitPosition.x - 10 &&
          x <= commitPosition.x + 10 &&
          y >= commitPosition.y - 10 &&
          y <= commitPosition.y + 10,
      );
      console.log({ commitClicked, commitsWithPos, x, y });
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

function addEventListenerToActionsBar(buttons, actionButtonHandlers) {
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("Clicked");
      const buttonText = button.innerText;

      if (buttonText in actionButtonHandlers) {
        actionButtonHandlers[buttonText]();
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

function main() {
  const repo = new git_module.Repository("."); // TODO let user choose path
  const commits = repo.get_commit_info();
  const changedFiles = repo.get_changed_files();
  const head = repo.get_repo_head();

  const canvas = document.querySelector("canvas");
  if (!canvas) throw Error("No canvas found");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw Error("No 2d context found");

  const messages = document.getElementById("messages");

  const repositoryRenderer = new RepositoryRenderer(
    commits,
    head,
    canvas,
    ctx,
    messages,
  );

  const branches = repositoryRenderer.branches;

  const buttonActions = document.querySelectorAll(".button");
  addEventListenerToActionsBar(buttonActions, actionButtonHandlers);

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

main();
