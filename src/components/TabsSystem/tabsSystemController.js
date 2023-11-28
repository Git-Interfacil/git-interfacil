let tabCache = {};

async function selectTab(tabName) {
  const tabs = document.querySelectorAll(".tablinks");

  tabs.forEach((tab) => {
    if (tab.id === tabName) {
      tab.classList.add("selected");
      console.log("selecting", tabName);
      // Perform actions for the newly selected tab if needed
    } else {
      tab.classList.remove("selected");
      // Perform actions for the previously selected tab if needed
    }
  });

  if (tabCache[tabName]) {
    document.getElementById("tabcontent").innerHTML = tabCache[tabName];
  } else {
    let tabContent = await generateTabContent(tabName);
    document.getElementById("tabcontent").innerHTML = tabContent;
    tabCache[tabName] = tabContent;
  }
  if (tabName === "Repository") {
    const { main } = require("../screens/Repository/renderer");
    main();
    console.log(document);
  } else if (tabName === "Home") {
    const { homeController } = require("../screens/Home/renderer");
    homeController();
  }
}

async function loadHTMLFile(tabName) {
  console.log("loading from html file: ", tabName);
  try {
    const response = await fetch(`../screens/${tabName}/index.html`);
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

async function generateTabContent(tabName) {
  const htmlContent = await loadHTMLFile(tabName);

  if (htmlContent) {
    console.log("html found: ");
    tabCache[tabName] = htmlContent;
    return htmlContent;
  } else {
    return `Failed to load content for ${tabName}`;
  }
}

function closeTab(tabCell) {
  console.log("closing: ", tabCell.id);
}

function tabsSystemController() {
  selectTab("Home");
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
      selectTab(tab.id);
    });
  });
}

tabsSystemController();
