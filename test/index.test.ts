const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "../src/index.html");
const htmlContent = fs.readFileSync(htmlPath, "utf-8");

beforeAll(() => {
  document.body.innerHTML = htmlContent;
});

describe("layout skeleton interface", () => {
  let appContainer, header, content;

  beforeAll(() => {
    appContainer = document.getElementById("app-container");
    header = appContainer.querySelector("#header");
    content = appContainer.querySelector("#content");
  });

  describe("with passing", () => {
    it("should render the application container", () => {
      expect(appContainer).not.toBeNull();
    });

    it("should render the header", () => {
      expect(header).not.toBeNull();
    });

    it("should render the content", () => {
      expect(content).not.toBeNull();
    });

    it("should render content after header", () => {
      expect(header.nextElementSibling).toBe(content);
    });
  });
});

describe("header skeleton interface", () => {
  let header, navigation, actions;

  beforeAll(() => {
    header = document.getElementById("header");
    navigation = header.querySelector("#navigation");
    actions = header.querySelector("#actions");
  });

  describe("with passing", () => {
    it("should render the header", () => {
      expect(header).not.toBeNull();
    });

    it("should render the navigation", () => {
      expect(navigation).not.toBeNull();
    });

    it("should render the actions", () => {
      expect(actions).not.toBeNull();
    });

    it("should render actions after navigation", () => {
      expect(navigation.nextElementSibling).toBe(actions);
    });
  });

  describe("with failing", () => {
    it("should not render more than navigation and actions", () => {
      expect(header.children[0]).toBe(navigation);
      expect(header.children[1]).toBe(actions);
      expect(header.children.length).toBe(2);
    });
  });
});

describe("content skeleton interface", () => {
  let content, sidebar, main;

  beforeAll(() => {
    content = document.getElementById("content");
    sidebar = content.querySelector("#sidebar");
    main = content.querySelector("#main");
  });

  describe("with passing", () => {
    it("should render the content", () => {
      expect(content).not.toBeNull();
    });

    it("should render the sidebar", () => {
      expect(sidebar).not.toBeNull();
    });

    it("should render the main container", () => {
      expect(main).not.toBeNull();
    });

    it("should render the main container after the sidebar", () => {
      expect(sidebar.nextElementSibling).toBe(main);
    });
  });
});
