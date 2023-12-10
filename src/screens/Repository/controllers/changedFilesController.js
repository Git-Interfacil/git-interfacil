function setCount(countElement, length, changedFilesLength) {
  countElement.innerHTML = length + "/" + changedFilesLength;
}

function increaseCount(countElement) {
  const values = countElement.innerHTML.split("/");
  const count = values[0];
  const changedFilesLength = values[1];
  setCount(countElement, parseInt(count) + 1, changedFilesLength);
}

function decreaseCount(countElement) {
  const values = countElement.innerHTML.split("/");
  const count = values[0];
  const changedFilesLength = values[1];
  setCount(countElement, parseInt(count) - 1, changedFilesLength);
}

function createChangedFile(changedFile, index) {
  const changedFileElement = document.createElement("li");
  changedFileElement.dataset.changedId = changedFile;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = false;
  checkbox.id = "changed-" + index;

  const label = document.createElement("label");
  label.htmlFor = "changed-" + index;
  label.appendChild(document.createTextNode(changedFile));

  changedFileElement.appendChild(checkbox);
  changedFileElement.appendChild(label);

  return changedFileElement;
}

function activateChangedFile(item) {
  const label = item.querySelector("label");
  label.classList.add("active");
}

function deactivateChangedFile(item) {
  const label = item.querySelector("label");
  label.classList.remove("active");
}

module.exports = {
  createChangedFile,
  setCount,
  increaseCount,
  decreaseCount,
  activateChangedFile,
  deactivateChangedFile,
};
