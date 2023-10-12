const constants = require("./constants.js");
const mocks = require("./mocks.js");
const canvasController = require("./canvasController.js");
const messagesController = require("./messagesController.js");

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
  drawBranches(canvas, ctx, head, commits, branches);
  fillMessages(messages, commits, branches);
}

main();
