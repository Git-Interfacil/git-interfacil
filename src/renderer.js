const constants = require("./constants.js");
const mocks = require("./mocks.js");
const canvasController = require("./canvasController.js");

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

function drawBranches(ctx, head, commits, branches) {
  commits.forEach(({ branchId, id: commitId }, ind) => {
    const parentBranch = branches.find(({ id }) => id === branchId);

    const pos = { x: parentBranch.pos.x, y: (ind + 1) * constants.LINE_HEIGHT };

    if (head == commitId)
      canvasController.drawCommit(ctx, pos, parentBranch.color, 8, true);
    else canvasController.drawCommit(ctx, pos, parentBranch.color);

    canvasController.drawLine(ctx, pos, parentBranch.pos, parentBranch.color);
  });
}

function fillMessages(messagesList, commits, branches) {
  commits.forEach(({ message, branchId, author }) => {
    const parentBranch = branches.find(({ id }) => id === branchId);

    const li = document.createElement("li");

    const spanMessage = document.createElement("span");
    spanMessage.classList.add("message");
    spanMessage.innerText = message;
    li.appendChild(spanMessage);

    const spanAuthor = document.createElement("span");
    spanAuthor.innerText = author;
    spanAuthor.classList.add("author");
    li.appendChild(spanAuthor);

    li.style.borderColor = parentBranch.color;

    messagesList.appendChild(li);
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

  setCanvasSize(canvas, branches.length, commits.length);
  drawBranches(ctx, head, commits, branches);
  fillMessages(messages, commits, branches);
}

main();