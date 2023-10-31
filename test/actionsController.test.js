/* eslint-disable no-undef */
const actionButtonsHandlers = require("../src/actionsController.js");

console.log = jest.fn();

describe("actionsController", () => {
  it('should handle "undo" button click', () => {
    actionButtonsHandlers.undo();
    expect(console.log).toHaveBeenCalledWith("Undo button clicked");
  });

  it('should handle "redo" button click', () => {
    actionButtonsHandlers.redo();
    expect(console.log).toHaveBeenCalledWith("Redo button clicked");
  });

  it("Merge Button", () => {
    actionButtonsHandlers.merge();
    expect(console.log).toHaveBeenCalledWith("Merge button clicked");
  });

  it("Pull Button", () => {
    actionButtonsHandlers.pull();
    expect(console.log).toHaveBeenCalledWith("Pull button clicked");
  });

  it("Push Button", () => {
    actionButtonsHandlers.push();
    expect(console.log).toHaveBeenCalledWith("Push button clicked");
  });

  it("Branch Button", () => {
    actionButtonsHandlers.branch();
    expect(console.log).toHaveBeenCalledWith("Branch button clicked");
  });

  it("Stash Button", () => {
    actionButtonsHandlers.stash();
    expect(console.log).toHaveBeenCalledWith("Stash button clicked");
  });

  it("Pop Button", () => {
    actionButtonsHandlers.pop();
    expect(console.log).toHaveBeenCalledWith("Pop button clicked");
  });
});
