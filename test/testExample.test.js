/* eslint-disable no-undef */
const testExample = require("../src/testExample");

describe("testExample", () => {
  it("sum should work correctly", () => {
    expect(testExample.sum(1, 2)).toBe(3);
  });
  it("sum should work correctly", () => {
    expect(testExample.multiply(2, 4)).toBe(8);
  });
});
