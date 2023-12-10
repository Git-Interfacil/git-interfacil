const ipcRendererManager = require("../utils/ipcRendererManager");
const { handleStoreWindowArgs } = require("../screens/Repository/renderer.js");

let currentTabName = "";
let reposOpen = [];

async function selectTab(path, tabName) {
  const tabs = document.querySelectorAll(".tablinks");

  if (currentTabName !== "") {
    document.getElementById(`tab${currentTabName}`).style.display = "none";
  }
  currentTabName = tabName;

  tabs.forEach((tab) => {
    if (tab.id === tabName) {
      tab.classList.add("selected");
    } else {
      tab.classList.remove("selected");
    }
  });

  const selectedTab = document.getElementById(`tab${tabName}`);
  if (selectedTab) {
    selectedTab.style.display = "flex";
  } else {
    let tabContent = await generateTabContent(path, tabName);
    tabContent.style.display = "flex";
    tabContent.style.flexGrow = "1";
    tabContent.style.flexDirection = "column";
    const tabsContainer = document.getElementById("tabcontent");
    tabsContainer.insertBefore(tabContent, tabsContainer.firstChild);
    if (tabName === "Home") {
      const { homeController } = require(`../screens/Home/renderer`);
      homeController();
    } else {
      const { main } = require(`../screens/Repository/renderer`);
      main();
    }
  }
  ipcRendererManager.sendCurrentTab(tabName, reposOpen[tabName]);
}

function loadCanvasInTab(path, tabName) {
  const args = handleStoreWindowArgs(path);
  reposOpen[tabName] = args;
  return reposOpen[tabName];
}

async function loadHTMLFile(path, tabName) {
  try {
    const response = await fetch(`${path}/index.html`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${tabName}`);
    }
    const htmlContent = await response.text();
    return htmlContent;
  } catch (error) {
    console.error(error);
    return `Content for ${tabName}`;
  }
}

async function generateTabContent(path, tabName) {
  const htmlContent = await loadHTMLFile(path, tabName);
  try {
    const containerTab = document.createElement("div");
    containerTab.setAttribute("id", `tab${tabName}`);
    containerTab.innerHTML = htmlContent;
    return containerTab;
  } catch (error) {
    return new Error(`Failed to load content for ${tabName}`);
  }
}

function closeTab(tabCell) {
  if (currentTabName === tabCell.id) {
    selectTab(`../screens/Home`, "Home");
  }
  const tabToClose = document.getElementById(`tab${tabCell.id}`);
  tabToClose.remove();

  reposOpen.splice(tabCell.id, 1);
}

module.exports = {
  selectTab,
  loadCanvasInTab,
  closeTab,
  loadHTMLFile,
  generateTabContent,
};
