const ipcRendererManager = require("../../../../utils/ipcRendererManager.js");
const Toast = require("../../../../components/Toast/toast.js");

function setFavorite(favoriteCell) {
  if (favoriteCell.classList.contains("favorite")) {
    favoriteCell.setAttribute("data-tooltip", "Add to favorites");
  } else {
    favoriteCell.setAttribute("data-tooltip", "Remove from favorites");
  }
  favoriteCell.classList.toggle("favorite");
  favoriteCell.classList.toggle("not-favorite");
}

async function deleteWorkspace(row) {
  try {
    row.parentElement.removeChild(row);
    await Toast.showToast("Workspace deleted", "../../assets/sucess-icon.svg");
  } catch (error) {
    await Toast.showToast(
      "Error: delete workspace",
      "../../assets/error-icon.svg",
    );
    console.error("Error deleting workspace: ", error);
  }
}

function updateTimestamps(doc = document) {
  const timestampCells = doc.querySelectorAll(".timestamp");
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

function addTooltip(button) {
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
}

function addEventListenerFavorite(button) {
  addTooltip(button);

  button.addEventListener("click", function (event) {
    setFavorite(button);
    event.stopPropagation();
  });
}

async function openDialog() {
  try {
    const options = {
      type: "question",
      buttons: ["Cancel", "Delete"],
      title: "Delete Workspace",
      message: "Do you really want to delete this workspace?",
      detail: "This process cannot be undone.",
    };

    const response = await ipcRendererManager.showMessageBox(options);
    return response;
  } catch (error) {
    console.error("Error in message box:", error);
  }
}
function addEventListenerDelete(button) {
  addTooltip(button);

  button.addEventListener("click", function (event) {
    openDialog().then((response) => {
      if (response === 1) {
        deleteWorkspace(button.parentElement);
      }
    });
    event.stopPropagation();
  });
}

function createNew(path) {
  const table = document.getElementById("workspacesTable");
  const newRow = document.createElement("tr");

  const favoriteIcon = document.createElement("img");
  favoriteIcon.src = "../../assets/favorite-icon.svg";

  const favoriteCell = document.createElement("td");
  favoriteCell.classList.add("not-favorite");
  favoriteCell.setAttribute("data-tooltip", "Add to favorites");

  addEventListenerFavorite(favoriteCell);
  favoriteCell.appendChild(favoriteIcon);

  const spanName = document.createElement("span");
  spanName.classList.add("bold");
  const pathArray = path.split("/");
  spanName.innerHTML = pathArray.pop();

  const directory = document.createElement("span");
  directory.innerHTML = path;

  const nameCell = document.createElement("td");
  nameCell.classList.add("directory");
  nameCell.appendChild(spanName);
  nameCell.appendChild(directory);

  const lastUpdatedSpan = document.createElement("span");
  lastUpdatedSpan.classList.add("lastUpdatedTime");

  const timestampCell = document.createElement("td");
  timestampCell.classList.add("timestamp");
  timestampCell.dataset.lastClicked = Date.now();
  timestampCell.appendChild(lastUpdatedSpan);

  const deleteIcon = document.createElement("img");
  deleteIcon.src = "../../assets/delete-icon.svg";

  const deleteCell = document.createElement("td");
  deleteCell.classList.add("delete");
  deleteCell.setAttribute("data-tooltip", "Remove workspace");

  addEventListenerDelete(deleteCell);
  deleteCell.appendChild(deleteIcon);

  newRow.appendChild(favoriteCell);
  newRow.appendChild(nameCell);
  newRow.appendChild(timestampCell);
  newRow.appendChild(deleteCell);

  newRow.addEventListener("click", function () {
    timestampCell.dataset.lastClicked = Date.now();
    updateTimestamps();
    ipcRendererManager.showScreenWithData("index", { path: path });
  });

  table.appendChild(newRow);
  updateTimestamps();
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
  updateTimestamps();
  setInterval(updateTimestamps, 60 * 1000);

  document.querySelectorAll(".favorite").forEach((button) => {
    addEventListenerFavorite(button);
  });
  document.querySelectorAll(".not-favorite").forEach((button) => {
    addEventListenerFavorite(button);
  });
  document.querySelectorAll(".delete").forEach((button) => {
    addEventListenerDelete(button);
  });
}

module.exports = {
  workspaces,
  addEventListenerFavorite,
  updateTimestamps,
  getTimeAgoString,
  setFavorite,
};
