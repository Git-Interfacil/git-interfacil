function setCount(countElement, length, branchesLength) {
  countElement.innerHTML = length + "/" + branchesLength;
}

function increaseCount(countElement) {
  const values = countElement.innerHTML.split("/");
  const count = values[0];
  const branchesLength = values[1];
  setCount(countElement, parseInt(count) + 1, branchesLength);
}

function decreaseCount(countElement) {
  const values = countElement.innerHTML.split("/");
  const count = values[0];
  const branchesLength = values[1];
  setCount(countElement, parseInt(count) - 1, branchesLength);
}

function createBranch(branch) {
  const branchElement = document.createElement("li");
  branchElement.style.display = "flex";
  branchElement.style.alignItems = "center";

  branchElement.dataset.branchId = branch.id;

  const checkbox = document.createElement("input");

  checkbox.type = "checkbox";
  checkbox.checked = true;
  checkbox.id = "local-" + branch.id;
  checkbox.style.accentColor = branch.color;

  const label = document.createElement("label");
  label.htmlFor = "local-" + branch.id;
  label.appendChild(document.createTextNode(branch.id));
  label.classList.add("active");
  label.style.transition = "all .3s";

  branchElement.appendChild(checkbox);
  branchElement.appendChild(label);

  return branchElement;
}

function activateBranch(item) {
  const label = item.querySelector("label");
  label.classList.add("active");
}

function deactivateBranch(item) {
  const label = item.querySelector("label");
  label.classList.remove("active");
}

module.exports = {
  createBranch,
  setCount,
  activateBranch,
  deactivateBranch,
  increaseCount,
  decreaseCount,
};
