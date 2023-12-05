//let tabCache = {};
let currentTabName = "";

function createNewTab(tabName, iconSrc = "../assets/repository-icon.svg") {
  const navigation = document.getElementById("navigation");

  const button = document.createElement("button");
  button.setAttribute("id", tabName);
  button.classList.add("tablinks");

  const icon = document.createElement("img");
  icon.classList.add("iconTab");
  icon.src = iconSrc;

  const span = document.createElement("span");
  span.classList.add("tabName");
  span.textContent = tabName;

  const closeDiv = document.createElement("div");
  closeDiv.classList.add("close");

  const closeIcon = document.createElement("img");
  closeIcon.src = "../assets/X.svg";

  closeDiv.appendChild(closeIcon);
  button.appendChild(icon);
  button.appendChild(span);
  button.appendChild(closeDiv);
  navigation.appendChild(button);

  closeDiv.addEventListener("click", () => {
    navigation.removeChild(button);
  });

  button.addEventListener("click", () => {
    console.log("the new tab is: ", tabName);
    selectTab(`../screens/Repository/index.html`, tabName);
  });
}

async function selectTab(path, tabName) {
  const tabs = document.querySelectorAll(".tablinks");
  if (currentTabName !== "") {
    console.log("hiding: ", currentTabName);
    document.getElementById(`tab${currentTabName}`).style.display = "none";
  }
  currentTabName = tabName;

  tabs.forEach((tab) => {
    if (tab.id === tabName) {
      tab.classList.add("selected");
      console.log("selecting", tabName);
    } else {
      tab.classList.remove("selected");
    }
  });

  const selectedTab = document.getElementById(`tab${tabName}`);
  if (selectedTab) {
    console.log("Its in chache");
    selectedTab.style.display = "flex";
  } else {
    console.log("creating new, not in cache");
    let tabContent = await generateTabContent(path, tabName);
    tabContent.style.display = "flex";
    tabContent.style.flexGrow = "1";
    tabContent.style.flexDirection = "column";
    console.log("tabContent: ", tabContent);
    document.getElementById("tabcontent").appendChild(tabContent);
    if (tabName === "Home") {
      const { homeController } = require(`../screens/Home/renderer`);
      homeController();
    } else {
      const { main } = require(`../screens/Repository/renderer`);
      main();
    }
  }
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
  const containerTab = document.createElement("div");
  containerTab.setAttribute("id", `tab${tabName}`);
  containerTab.innerHTML = htmlContent;
  if (containerTab) {
    return containerTab;
  } else {
    return `Failed to load content for ${tabName}`;
  }
}

function closeTab(tabCell) {
  console.log("closing: ", tabCell.id);
}

function tabsSystemController() {
  selectTab(`../screens/Home`, "Home");
  const tab = document.getElementById("Home");
  tab.classList.add("selected");

  const closeButtons = document.querySelectorAll(".close");
  closeButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      closeTab(button.parentElement);
      event.stopPropagation();
    });
  });

  const tabLinks = document.querySelectorAll(".tablinks");
  tabLinks.forEach((tab) => {
    tab.addEventListener("click", function () {
      selectTab(`../screens/${tab.id}`, tab.id);
    });
  });
}

tabsSystemController();

module.exports = { createNewTab, selectTab };
