const constants = require("./constants.js");
const mocks = require("./mocks.js");
const canvasController = require("./canvasController.js");
const messagesController = require("./messagesController.js");
const localBranchesController = require("./localBranchesController.js");
const animationsController = require("./animationsController.js");
const actionButtonHandlers = require("./actionsController.js");

function setCanvasSize(canvas, num_branches, num_commits) {
  canvas.width = constants.COLUMN_WIDTH * (num_branches + 1);
  canvas.height = constants.LINE_HEIGHT * (num_commits + 1);
}

function generateBranches(commits) {
  const branches = [];
  commits.forEach(({ branchId }, ind) => {
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

function drawBranches(canvas, ctx, head, commits, branches) {
  const commitsWithPos = commits.map((commit, ind) => {
    const parentBranch = branches.find(({ id }) => id === commit.branchId);

    const pos = { x: parentBranch.pos.x, y: (ind + 1) * constants.LINE_HEIGHT };

    if (head == commit.id)
      canvasController.drawCommit(ctx, pos, parentBranch.color, 8, true);
    else canvasController.drawCommit(ctx, pos, parentBranch.color);

    canvasController.drawLine(ctx, pos, parentBranch.pos, parentBranch.color);
    return { ...commit, pos };
  });

  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
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

function fillMessages(messagesList, commits, branches) {
  commits.forEach(({ message, branchId, author }) => {
    const parentBranch = branches.find(({ id }) => id === branchId);
    const messageElement = messagesController.createMessage(
      message,
      author,
      parentBranch.color,
    );
    messagesList.appendChild(messageElement);
  });
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

function addListenersToLocalBranchesCheckboxes(list, counter) {
  list.forEach((item) => {
    const checkbox = item.querySelector("input");

    checkbox.addEventListener("change", () => {
      if (!checkbox.checked) {
        localBranchesController.deactivateBranch(item);
        localBranchesController.decreaseCount(counter);

        // TO-DO: remove branch from canvas
      } else {
        localBranchesController.activateBranch(item);
        localBranchesController.increaseCount(counter);

        // TO-DO: add branch to canvas
      }
    });
  });
}

function main() {
  const commits = mocks.COMMITS_MOCK.commits;

  commits.sort(
    (a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
  );

  const branches = generateBranches(commits);
  const head = mocks.COMMITS_MOCK.head;

  const canvas = document.querySelector("canvas");
  if (!canvas) throw Error("No canvas found");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw Error("No 2d context found");

  const messages = document.getElementById("messages");
  const buttonActions = document.querySelectorAll(".button");

  addEventListenerToActionsBar(buttonActions, actionButtonHandlers);
  const sidebar = document.getElementById("sidebar");
  const localBranches = document.getElementById("localList");
  const localBranchesCount = document.getElementById("localCount");

  setCanvasSize(canvas, branches.length, commits.length);
  fillLocalBranches(localBranches, localBranchesCount, branches);
  drawBranches(canvas, ctx, head, commits, branches);
  fillMessages(messages, commits, branches);

  const sidebarDropdowns = sidebar.querySelectorAll(".dropdown");
  const localBranchesList = localBranches.querySelectorAll("li");

  addListenersToSidebar(sidebarDropdowns);
  addListenersToLocalBranchesCheckboxes(localBranchesList, localBranchesCount);
}

main();
