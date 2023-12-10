/* eslint-disable no-undef */
const fs = require("fs");
const path = require("path");
const htmlPath = path.join(__dirname, "../../src/TabsSystem/index.html");
const htmlContent = fs.readFileSync(htmlPath, "utf-8");
const { tabsSystem, createNewTab } = require("../../src/TabsSystem/tabsSystem");
const {
  selectTab,
  closeTab,
} = require("../../src/TabsSystem/tabsSystemController");

jest.mock("../../src/TabsSystem/tabsSystemController", () => {
  return {
    selectTab: jest.fn(),
    closeTab: jest.fn(),
  };
});

beforeAll(() => {
  document.body.innerHTML = htmlContent;
});

describe("tabsSystem file", () => {
  beforeAll(() => {
    navigation = document.getElementById("navigation");
    appContainer = document.getElementById("app-container");
    tabsContainer = document.getElementById("tabcontent");
    homeTab = document.getElementById("Home");
    tabs = document.querySelectorAll(".tablinks");
  });

  describe("with passing", () => {
    it("should render app-container", () => {
      expect(appContainer).not.toBeNull();
    });
    it("should render navigation", () => {
      expect(navigation).not.toBeNull();
    });
    it("should render just Home tab inside navigation div", () => {
      expect(tabs.length).toBe(1);

      expect(homeTab).not.toBeNull();

      const imgElement = homeTab.querySelector(".iconTab");
      const spanElement = homeTab.querySelector(".tabName");

      expect(imgElement).not.toBeNull();
      expect(spanElement).not.toBeNull();

      expect(imgElement.src).toContain("/assets/workspace-icon.svg");
      expect(spanElement.innerHTML).toBe("Workspaces");
    });
    it("should render tabcontent", () => {
      expect(tabsContainer).not.toBeNull();
    });
  });

  describe("CreateNewTab tests", () => {
    it("should create a new tab with the provided name and icon", () => {
      const tabName = "Test Tab";
      const iconSrc = "test-icon.png";
      const oldTabsNumber = navigation.children.length;

      createNewTab(tabName, iconSrc);

      expect(navigation.children.length).toBe(oldTabsNumber + 1);

      const tabCreated = document.getElementById(tabName);

      const tabIcon = tabCreated.querySelector(".iconTab");
      expect(tabIcon).toBeTruthy();
      expect(tabIcon.src).toContain(iconSrc);

      const tabSpan = tabCreated.querySelector(".tabName");
      expect(tabSpan).toBeTruthy();
      expect(tabSpan.textContent).toBe(tabName);

      const closeDiv = tabCreated.querySelector(".close");
      expect(closeDiv).toBeTruthy();

      const closeIcon = closeDiv.querySelector("img");
      expect(closeIcon).toBeTruthy();
      expect(closeIcon.src).toContain("X.svg");
    });
    it("should create a new tab with the provided name and default icon", () => {
      const tabName = "Test Default Icon";
      const oldTabsNumber = navigation.children.length;

      createNewTab(tabName);

      expect(navigation.children.length).toBe(oldTabsNumber + 1);
      const tabCreated = document.getElementById(tabName);

      const tabIcon = tabCreated.querySelector(".iconTab");
      expect(tabIcon).toBeTruthy();
      expect(tabIcon.src).toContain("/assets/repository-icon.svg");

      const tabSpan = tabCreated.querySelector(".tabName");
      expect(tabSpan).toBeTruthy();
      expect(tabSpan.textContent).toBe(tabName);

      const closeDiv = tabCreated.querySelector(".close");
      expect(closeDiv).toBeTruthy();

      const closeIcon = closeDiv.querySelector("img");
      expect(closeIcon).toBeTruthy();
      expect(closeIcon.src).toContain("X.svg");
    });

    it("should attach event listeners to the newly created tab", () => {
      const tabName = "TestEventListener";
      const iconSrc = "test-icon.png";

      createNewTab(tabName, iconSrc);

      const tabCreated = document.getElementById(tabName);
      const closeDiv = tabCreated.querySelector(".close");

      const oldTabsNumber = navigation.children.length;
      closeDiv.click();
      expect(navigation.children.length).toBe(oldTabsNumber - 1);

      tabCreated.click();
      expect(selectTab).toHaveBeenCalledWith(expect.any(String), tabName);
    });
  });

  describe("initialization of tabsSystemController", () => {
    beforeAll(() => {
      const firstCloseButton = document.createElement("button");
      const secondCloseButton = document.createElement("button");

      firstCloseButton.classList.add("tablinks");
      firstCloseButton.setAttribute("id", "Home");
      secondCloseButton.classList.add("tablinks");

      firstCloseDiv = document.createElement("div");
      secondCloseDiv = document.createElement("div");

      firstCloseDiv.classList.add("close");
      secondCloseDiv.classList.add("close");

      firstCloseButton.appendChild(firstCloseDiv);
      secondCloseButton.appendChild(secondCloseDiv);

      navigation.appendChild(firstCloseButton);
      navigation.appendChild(secondCloseButton);
    });

    it("should select 'Home' tab when app is opened", () => {
      tabsSystem();
      expect(selectTab).toHaveBeenCalledWith(`../screens/Home`, "Home");
    });

    it("should add click event listener for both close buttons", () => {
      tabsSystem();
      const closeButtons = document.querySelectorAll(".close");
      closeButtons.forEach((button) => {
        button.click();
        expect(closeTab).toHaveBeenCalledWith(button.parentElement);
      });
    });

    it("should add click event listener for both tab links", () => {
      tabsSystem();
      const tabLinks = document.querySelectorAll(".tablinks");
      tabLinks.forEach((tab) => {
        tab.click();
        expect(selectTab).toHaveBeenCalledWith(`../screens/${tab.id}`, tab.id);
      });
    });
  });
});
