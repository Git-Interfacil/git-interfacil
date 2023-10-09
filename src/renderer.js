const constants = require("./constants.js");
const mocks = require("./mocks.js");
const canvasController = require("./canvasController.js");

const commits = mocks.COMMITS_MOCK.commits;
const head = mocks.COMMITS_MOCK.head;

const canvas = document.querySelector("canvas");
if (!canvas) throw Error("No canvas found");
const ctx = canvas.getContext("2d");
if (!ctx) throw Error("No 2d context found");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

commits.sort(
  (a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
);

const branches = [];
commits.forEach(({ branchId, id: commitId }, ind) => {
  let parentBranch = branches.find(({ id }) => id === branchId);
  if (!parentBranch) {
    parentBranch = {
      id: branchId,
      pos: {
        x: (branches.length + 1) * constants.COLUMN_WIDTH,
        y: (ind + 1) * constants.LINE_HEIGHT,
      },
      color: constants.COLORS[branches.length],
    };
    branches.push(parentBranch);
  }

  const pos = { x: parentBranch.pos.x, y: (ind + 1) * constants.LINE_HEIGHT };

  if (head == commitId)
    canvasController.drawCommit(ctx, pos, parentBranch.color, 8, true);
  else canvasController.drawCommit(ctx, pos, parentBranch.color);

  canvasController.drawLine(ctx, pos, parentBranch.pos, parentBranch.color);
});
