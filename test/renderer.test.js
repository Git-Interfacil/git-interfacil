/* eslint-disable no-undef */

jest.mock("../src/canvasController.js");
jest.mock("../src/RepoSelector.js");
jest.mock("../src/messagesController.js");
jest.mock("../src/localBranchesController.js");

describe.skip("renderer", () => {
  let repoSelector;
  beforeEach(() => {
    jest.clearAllMocks();
    repoSelector = document.createElement("input");
    document.getElementById = () => repoSelector;
  });

  it("should not render if no canvas", () => {
    document.querySelector = jest.fn();
    try {
      require("../src/renderer.js");
      repoSelector.dispatchEvent(new CustomEvent("change"));
      expect(true).toBe(false); // Above line should throw error
    } catch (e) {
      expect(e.message).toBe("No canvas found");
    }
  });

  it("should not render if no canvas's 2d context", () => {
    document.querySelector = () => ({ getContext: () => null });
    try {
      require("../src/renderer.js");
      repoSelector.dispatchEvent(new CustomEvent("change"));
      expect(true).toBe(false); // Above line should throw error
    } catch (e) {
      expect(e.message).toBe("No 2d context found");
    }
  });
});
