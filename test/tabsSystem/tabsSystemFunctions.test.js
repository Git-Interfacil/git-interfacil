/* eslint-disable no-undef */
const fs = require("fs");
const path = require("path");
const htmlPath = path.join(__dirname, "../../src/TabsSystem/index.html");
const htmlContent = fs.readFileSync(htmlPath, "utf-8");
const {
  loadCanvasInTab,
  loadHTMLFile,
  generateTabContent,
  closeTab,
  selectTab,
} = require("../../src/TabsSystem/tabsSystemController");
const {
  handleStoreWindowArgs,
  main,
} = require("../../src/screens/Repository/renderer.js");
const { homeController } = require("../../src/screens/Home/renderer.js");

global.fetch = jest.fn();
console.error = jest.fn();

jest.mock("../../src/screens/Repository/renderer.js", () => {
  return {
    handleStoreWindowArgs: jest.fn().mockReturnValue("MockedReturnValue"),
    main: jest.fn(),
  };
});

jest.mock("../../src/screens/Home/renderer.js", () => {
  return {
    homeController: jest.fn(),
  };
});

jest.mock("electron", () => ({
  ipcRenderer: {
    send: jest.fn(),
  },
}));

beforeAll(() => {
  document.body.innerHTML = htmlContent;
});

describe("tabsSystemController file", () => {
  beforeAll(() => {
    navigation = document.getElementById("navigation");
    appContainer = document.getElementById("app-container");
    content = document.getElementById("tabcontent");
  });

  describe("closeTab function", () => {
    it("should close the current tab", () => {
      const tabName = "testTab";
      const button = document.createElement("button");
      button.setAttribute("id", tabName);
      const containerTab = document.createElement("div");
      containerTab.setAttribute("id", `tab${tabName}`);

      navigation.appendChild(button);
      content.appendChild(containerTab);

      expect(document.getElementById(`tab${tabName}`)).not.toBeNull();

      closeTab(button);

      expect(document.getElementById(`tab${tabName}`)).toBeNull();
    });

    it("should not close a different tab", () => {
      const tabName = "testTab";
      const button = document.createElement("button");
      button.setAttribute("id", tabName);
      const containerTab = document.createElement("div");
      containerTab.setAttribute("id", `tab${tabName}`);

      navigation.appendChild(button);
      content.appendChild(containerTab);

      const tabName2 = "tesNotToClose";
      const button2 = document.createElement("button");
      button2.setAttribute("id", tabName2);
      const containerTab2 = document.createElement("div");
      containerTab2.setAttribute("id", `tab${tabName2}`);

      navigation.appendChild(button2);
      content.appendChild(containerTab2);

      expect(document.getElementById(`tab${tabName}`)).not.toBeNull();
      expect(document.getElementById(`tab${tabName2}`)).not.toBeNull();

      closeTab(button);

      expect(document.getElementById(`tab${tabName2}`)).not.toBeNull();
      expect(document.getElementById(`tab${tabName}`)).toBeNull();
    });
  });

  describe("selectTab function", () => {
    it("should add selected class to tabName and remove from others", async () => {
      const path = "path/to/file";
      const tabName = "testTab";
      const button = document.createElement("button");
      button.setAttribute("id", tabName);
      navigation.appendChild(button);
      button.classList.add("tablinks");
      const containerTab = document.createElement("div");
      containerTab.setAttribute("id", `tab${tabName}`);
      content.appendChild(containerTab);

      const tabName2 = "testTab2";
      const button2 = document.createElement("button");
      button2.setAttribute("id", tabName2);
      navigation.appendChild(button2);
      button2.classList.add("tablinks");

      const tabName3 = "testTab3";
      const button3 = document.createElement("button");
      button3.setAttribute("id", tabName3);
      navigation.appendChild(button3);
      button3.classList.add("tablinks");

      const tabs = document.querySelectorAll(".tablinks");
      expect(tabs.length).toBe(4);

      await selectTab(path, tabName);

      expect(button.classList).toContain("selected");
      expect(button2.classList).not.toContain("selected");
      expect(button3.classList).not.toContain("selected");

      const tabHome = document.getElementById("Home");
      expect(tabHome.classList).not.toContain("selected");
    });

    it("should change style display if already exists", () => {
      const selectedTab = document.getElementById("tabtestTab");
      expect(selectedTab.style.display).toBe("flex");
    });

    it("should insert newtab before the first one if doenst exist", async () => {
      const path = "path/to/file";
      const tabName = "tabToCreate";
      content = document.getElementById("tabcontent");
      const oldFirstChild = content.firstChild;

      await selectTab(path, tabName);

      expect(content.firstChild).not.toBe(oldFirstChild);
    });

    it("should call homeController if tabName is Home and main otherwise", async () => {
      const homeTab = "Home";
      const otherTab = "Test";

      await selectTab(path, homeTab);
      expect(homeController).toHaveBeenCalled();

      await selectTab(path, otherTab);
      expect(main).toHaveBeenCalled();
    });
  });
  describe("loadCanvasInTab", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it("should call handleStoreWindowArgs with path and set args returned in global var reposOpen", () => {
      const path = "path/test";
      const tabName = "testTabName";

      const args = loadCanvasInTab(path, tabName);
      expect(handleStoreWindowArgs).toBeCalledWith(path);
      expect(args).toBe("MockedReturnValue");
    });
  });

  describe("loadHTMLFile", () => {
    beforeEach(() => {
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it("should fetch HTML content and return it", async () => {
      const path = "path/to/file";
      const tabName = "testTab";

      const mockHTMLContent = "<html>Mocked HTML content</html>";
      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockHTMLContent),
      });

      const htmlContent = await loadHTMLFile(path, tabName);

      expect(fetch).toHaveBeenCalledWith(`${path}/index.html`);
      expect(htmlContent).toBe(mockHTMLContent);
    });

    it("should handle failed fetch and return default content", async () => {
      const path = "path/to/file";
      const tabName = "testTab";

      global.fetch.mockResolvedValue({
        ok: false,
      });

      const defaultContent = await loadHTMLFile(path, tabName);

      expect(fetch).toHaveBeenCalledWith(`${path}/index.html`);
      expect(defaultContent).toBe(`Content for ${tabName}`);
    });

    it("should handle fetch errors and return default content", async () => {
      const path = "path/to/file";
      const tabName = "testTab";
      const errorMessage = "Failed to fetch";

      global.fetch.mockRejectedValue(new Error(errorMessage));

      const defaultContent = await loadHTMLFile(path, tabName);

      expect(fetch).toHaveBeenCalledWith(`${path}/index.html`);
      expect(defaultContent).toBe(`Content for ${tabName}`);
    });
  });

  describe("generateTabContent", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("should generate tab content with HTML content", async () => {
      const path = "path/to/file";
      const tabName = "testTab";

      const mockHTMLContent = "<html>Mocked HTML content</html>";
      global.fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockHTMLContent),
      });

      const containerTab = await generateTabContent(path, tabName);

      expect(containerTab).toBeTruthy();

      expect(containerTab instanceof HTMLElement).toBeTruthy();
      expect(containerTab.id).toBe(`tab${tabName}`);
      expect(containerTab.innerHTML).toBe("Mocked HTML content");
    });

    it("should handle failure to generate tab content", async () => {
      const path = "invalid/path";
      const tabName = "invalidTab";

      global.document.createElement = jest.fn(() => {
        console.error("Failed to create element");
      });

      const errorMessage = await generateTabContent(path, tabName);
      expect(errorMessage).toStrictEqual(
        new Error(`Failed to load content for ${tabName}`),
      );
    });
  });
});
