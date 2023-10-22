/* eslint-disable no-undef */
const {
  createBranch,
  setCount,
  activateBranch,
  deactivateBranch,
  increaseCount,
  decreaseCount,
} = require("../src/localBranchesController.js");

describe("createBranch", () => {
  it("should create a branch element with a checkbox and label", () => {
    const branch = { id: "branch1" };
    const branchElement = createBranch(branch);

    expect(branchElement.tagName).toBe("LI");

    const checkbox = branchElement.querySelector("input[type=checkbox]");
    expect(checkbox).toBeDefined();
    expect(checkbox.id).toBe("local-" + branch.id);
    expect(checkbox.checked).toBe(true);

    const label = branchElement.querySelector("label");
    expect(label).toBeDefined();
    expect(label.htmlFor).toBe("local-" + branch.id);
    expect(label.textContent).toBe(branch.id);
    expect(label.classList.contains("active")).toBe(true);
  });
});

describe("setCount", () => {
  it("should set the innerHTML of the count element correctly", () => {
    const countElement = document.createElement("div");
    setCount(countElement, 5, 10);
    expect(countElement.innerHTML).toBe("5/10");
  });
});

describe("increaseCount", () => {
  it("should increase the count correctly", () => {
    const countElement = document.createElement("div");
    countElement.innerHTML = "5/10";
    increaseCount(countElement);
    expect(countElement.innerHTML).toBe("6/10");
  });
});

describe("decreaseCount", () => {
  it("should decrease the count correctly", () => {
    const countElement = document.createElement("div");
    countElement.innerHTML = "5/10";
    decreaseCount(countElement);
    expect(countElement.innerHTML).toBe("4/10");
  });
});

describe("activateBranch", () => {
  it("should add 'active' class to the label of a branch element", () => {
    const branchElement = document.createElement("li");
    const label = document.createElement("label");
    branchElement.appendChild(label);
    activateBranch(branchElement);
    expect(label.classList.contains("active")).toBe(true);
  });
});

describe("deactivateBranch", () => {
  it("should remove 'active' class from the label of a branch element", () => {
    const branchElement = document.createElement("li");
    const label = document.createElement("label");
    label.classList.add("active");
    branchElement.appendChild(label);
    deactivateBranch(branchElement);
    expect(label.classList.contains("active")).toBe(false);
  });
});
