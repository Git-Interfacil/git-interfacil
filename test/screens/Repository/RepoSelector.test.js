/* eslint-disable no-undef */
const RepoSelector = require("../../../src/screens/Repository/RepoSelector.js");

const inputSelector = document.createElement("input");
const inputLoading = document.createElement("div");
const elements = {
  repoSelector: inputSelector,
  repoSelectorLoading: inputLoading,
};
describe("RepoSelector", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.getElementById = (id) => elements[id];
  });

  it("should set loading on inputSelector click", () => {
    new RepoSelector();
    inputSelector.dispatchEvent(new CustomEvent("click"));

    expect(inputLoading.style.getPropertyValue("display")).toBe("flex");
  });
});
