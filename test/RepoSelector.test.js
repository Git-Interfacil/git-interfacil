/* eslint-disable no-undef */
const RepoSelector = require("../src/RepoSelector.js");

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

  it.skip("should get the head file correctly", () => {
    Object.defineProperty(inputSelector, "files", [
      {
        webkitRelativePath: "myRepo/.git/HEAD",
        path: "myUser/myRepo/.git/HEAD",
      },
    ]);
    const repoSelector = new RepoSelector();
    // eslint-disable-next-line no-global-assign
    const changeEvent = new CustomEvent("change");
    inputSelector.dispatchEvent(changeEvent);

    expect(inputLoading.style.getPropertyValue("display")).toBe("none");
    expect(repoSelector.getDirPath()).toBe("myUser/myRepo/");
  });

  it.skip("should alert if no files were selected", () => {
    new RepoSelector();
    // eslint-disable-next-line no-global-assign
    alert = jest.fn();
    const changeEvent = new CustomEvent("change");
    inputSelector.dispatchEvent(changeEvent);

    expect(inputLoading.style.getPropertyValue("display")).toBe("none");
    expect(alert).toBeCalled();
  });

  it("should set loading on inputSelector click", () => {
    new RepoSelector();
    inputSelector.dispatchEvent(new CustomEvent("click"));

    expect(inputLoading.style.getPropertyValue("display")).toBe("flex");
  });
});
