/* eslint-disable no-undef */
const fs = require("fs");
const path = require("path");

const htmlPath = path.join(
  __dirname,
  "../../../src/screens/Repository/index.html",
);
const htmlContent = fs.readFileSync(htmlPath, "utf-8");

beforeAll(() => {
  document.body.innerHTML = htmlContent;
});

describe("layout skeleton interface", () => {
  let header, content;

  beforeAll(() => {
    header = document.querySelector("#header");
    content = document.querySelector("#content");
  });

  describe("with passing", () => {
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
  let header, actions;

  beforeAll(() => {
    header = document.getElementById("header");
    actions = header.querySelector("#actions");
  });

  describe("with passing", () => {
    it("should render the header", () => {
      expect(header).not.toBeNull();
    });

    it("should render the actions", () => {
      expect(actions).not.toBeNull();
    });
  });

  describe("with failing", () => {
    it("should not render more than actions", () => {
      expect(header.children[0]).toBe(actions);
      expect(header.children.length).toBe(1);
    });
  });
});

describe("content skeleton interface", () => {
  let content, canvas;

  beforeAll(() => {
    content = document.getElementById("content");
    canvas = content.querySelector("canvas");
  });

  describe("with passing", () => {
    it("should render the content", () => {
      expect(content).not.toBeNull();
    });

    it("should render canvas", () => {
      expect(canvas).not.toBeNull();
    });
  });
});
