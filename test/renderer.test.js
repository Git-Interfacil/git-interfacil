/* eslint-disable no-undef */

jest.mock("../src/canvasController.js");
jest.mock("../src/messagesController.js");
jest.mock("../src/localBranchesController.js");

describe("renderer", () => {
  beforeEach(() => jest.clearAllMocks());
  it("should not render if no canvas", () => {
    document.querySelector = jest.fn();
    try {
      require("../src/renderer.js");
      expect(true).toBe(false); // Above line should throw error
    } catch (e) {
      expect(e.message).toBe("No canvas found");
    }
  });

  it("should not render if no canvas's 2d context", () => {
    document.querySelector = () => ({ getContext: () => null });
    try {
      require("../src/renderer.js");
      expect(true).toBe(false); // Above line should throw error
    } catch (e) {
      expect(e.message).toBe("No 2d context found");
    }
  });
});
