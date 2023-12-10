/* eslint-disable no-undef */

jest.mock("../../../src/screens/Repository/controllers/canvasController.js");
jest.mock("../../../src/screens/Repository/RepoSelector.js");
jest.mock("../../../src/screens/Repository/controllers/messagesController.js");
jest.mock(
  "../../../src/screens/Repository/controllers/localBranchesController.js",
);

jest.mock("electron", () => ({
  ipcRenderer: {
    // send: jest.fn(),
    // once: jest.fn(),
    // invoke: jest.fn(),
    on: jest.fn(),
  },
}));

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
      require("../../../src/renderer.js");
      repoSelector.dispatchEvent(new CustomEvent("change"));
      expect(true).toBe(false); // Above line should throw error
    } catch (e) {
      expect(e.message).toBe("No canvas found");
    }
  });

  it("should not render if no canvas's 2d context", () => {
    document.querySelector = () => ({ getContext: () => null });
    try {
      require("../../../src/renderer.js");
      repoSelector.dispatchEvent(new CustomEvent("change"));
      expect(true).toBe(false); // Above line should throw error
    } catch (e) {
      expect(e.message).toBe("No 2d context found");
    }
  });
});
