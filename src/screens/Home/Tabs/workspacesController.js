const ipcRendererManager = require("../../../utils/ipcRendererManager");

function setFavorite(favoriteCell) {
  if (favoriteCell.className === "favorite") {
    favoriteCell.className = "not-favorite";
    favoriteCell.setAttribute("data-tooltip", "Add to favorites");
  } else {
    favoriteCell.className = "favorite";
    favoriteCell.setAttribute("data-tooltip", "Remove from favorites");
  }
}

function updateTimestamps(document) {
  const timestampCells = document.querySelectorAll(".timestamp");
  timestampCells.forEach((timestampCell) => {
    const timestampElement = timestampCell.querySelector(".lastUpdatedTime");
    const lastClickedTime = new Date(timestampCell.dataset.lastClicked);
    const elapsedTime = Date.now() - lastClickedTime.getTime();

    const timeAgo = getTimeAgoString(elapsedTime);
    timestampElement.textContent = timeAgo;
  });
}

function getTimeAgoString(timeDifference) {
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else {
    return "Just now";
  }
}

function addEventListenerFavorite(button) {
  button.addEventListener("mousemove", (event) => {
    const tooltipText = button.getAttribute("data-tooltip");
    let tooltip = document.querySelector(".tooltip");

    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      document.body.appendChild(tooltip);
    }

    tooltip.textContent = tooltipText;
    tooltip.style.top = event.clientY + 15 + "px";
    tooltip.style.left = event.clientX + "px";
  });

  button.addEventListener("mouseout", () => {
    const tooltip = document.querySelector(".tooltip");
    if (tooltip) {
      tooltip.remove();
    }
  });

  button.addEventListener("click", function (event) {
    setFavorite(button);
    event.stopPropagation();
  });
}

function createNew(path) {
  const table = document.getElementById("workspacesTable");
  const newRow = document.createElement("tr");

  const favoriteCell = document.createElement("td");
  const favoriteIcon = document.createElement("img");
  favoriteIcon.src = "../../assets/favorite-icon.svg";
  favoriteCell.className = ".has-tooltip";
  favoriteCell.classList.add("not-favorite");
  favoriteCell.setAttribute("data-tooltip", "Add to favorites");

  addEventListenerFavorite(favoriteCell);
  favoriteCell.appendChild(favoriteIcon);
  newRow.appendChild(favoriteCell);

  const nameCell = document.createElement("td");
  const spanName = document.createElement("span");
  spanName.className = "bold";
  const pathArray = path.split("/");
  spanName.innerHTML = pathArray.pop();
  const directory = document.createElement("span");
  directory.className = "directory";
  directory.innerHTML = path;

  nameCell.appendChild(spanName);
  nameCell.appendChild(directory);

  newRow.appendChild(nameCell);

  const timestampCell = document.createElement("td");
  timestampCell.className = "timestamp";
  const lastUpdatedSpan = document.createElement("span");
  lastUpdatedSpan.className = "lastUpdatedTime";
  timestampCell.dataset.lastClicked = "November 20, 2023 12:00:00";
  timestampCell.appendChild(lastUpdatedSpan);
  newRow.appendChild(timestampCell);

  newRow.addEventListener("click", function () {
    timestampCell.dataset.lastClicked = new Date();
    updateTimestamps(document);
    ipcRendererManager.showScreenWithData("index", { path: path });
  });

  table.appendChild(newRow);
  updateTimestamps(document);
}

function workspaces() {
  const button = document.getElementById("newButton");

  button.addEventListener("click", function () {
    ipcRendererManager.sendToMain("open-folder-dialog");
  });

  ipcRendererManager.listenToMain("selected-folder", (event, path) => {
    createNew(path);
    // ipcRendererManager.showScreenWithData("index", { path: path });
  });
  updateTimestamps(document);
  setInterval(updateTimestamps, 60 * 1000);

  document.querySelectorAll(".has-tooltip").forEach((button) => {
    addEventListenerFavorite(button);
  });
}

module.exports = {
  workspaces,
  addEventListenerFavorite,
  updateTimestamps,
  getTimeAgoString,
  setFavorite,
};
