const constants = require("./constants.ts");
const mocks = require("./mocks.ts");

const commits = mocks.COMMITS_MOCK;

const branches = Array.from(new Set(commits.map(({ branchId }) => branchId)));

const branchesElements = branches.map((branch, i) => {
  const branchElement = document.createElement("div");
  branchElement.classList.add("branch");
  branchElement.style.borderColor = constants.COLORS[i];
  return { id: branch, branchElement, color: constants.COLORS[i] };
});

commits.sort(
  (a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
);

commits.forEach(({ branchId }, i) => {
  const parentBranchElement = branchesElements.find(
    ({ id }) => branchId === id,
  );
  if (!parentBranchElement) return;
  const commitElement = document.createElement("div");
  commitElement.classList.add("commit");
  commitElement.style.top = `${-10 + i * 40}px`;
  commitElement.style.borderColor = parentBranchElement.color;
  parentBranchElement.branchElement.appendChild(commitElement);
});

branchesElements.forEach(
  ({ branchElement }) =>
    document.getElementById("branches-container")?.appendChild(branchElement),
);
