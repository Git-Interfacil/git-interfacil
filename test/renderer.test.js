/* eslint-disable no-undef */
const { drawLine, drawCommit } = require("../src/canvasController.js");
const { createMessage } = require("../src/messagesController.js");
const { createBranch } = require("../src/localBranchesController.js");

jest.mock("../src/canvasController.js");
jest.mock("../src/messagesController.js");
jest.mock("../src/localBranchesController.js");
const ctxMock = jest.fn();
const liMock = jest.fn();
const elementsMock = jest.fn();

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

  it("should render correctly", () => {
    document.querySelector = () => ({
      getContext: () => ctxMock,
      addEventListener: jest.fn(),
    });
    document.getElementById = () => ({
      appendChild: () => liMock,
      querySelectorAll: () => ({
        forEach: () => elementsMock,
      }),
    });
    require("../src/renderer.js");

    expect(drawCommit).toHaveBeenCalled();
    expect(drawLine).toHaveBeenCalled();
    expect(createMessage).toHaveBeenCalled();
    expect(createBranch).toHaveBeenCalled();
  });
});
