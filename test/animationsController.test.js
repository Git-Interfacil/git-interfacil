/* eslint-disable no-undef */
const { slideUp, slideToggle } = require("../src/animationsController.js");

describe("slideUp", () => {
  it("should set the height to 0", () => {
    const elem = document.createElement("div");
    elem.style.height = "100px";
    slideUp(elem);
    expect(elem.style.height).toBe("0px");
  });
});

describe("slideToggle", () => {
  it("should slide up when the element's height is not 0", () => {
    const elem = document.createElement("div");
    elem.style.height = "100px";
    slideToggle(elem);
    expect(elem.style.height).toBe("0px");
  });
});
