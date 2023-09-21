describe("renderer", () => {
  document.body.innerHTML = `
        <div id="branches-container"></div>
    `;
  require("../src/renderer.ts");

  it("should render correct amount of branches", () => {
    expect(document.querySelectorAll(".branch")).toHaveLength(3);
  });

  it("should render correct amount of commits", () => {
    expect(document.querySelectorAll(".commit")).toHaveLength(14);
  });

  it("should render correct amount of commits for each branch", () => {
    const branches = document.querySelectorAll(".branch");

    expect(branches[0].querySelectorAll(".commit")).toHaveLength(6);
    expect(branches[1].querySelectorAll(".commit")).toHaveLength(3);
    expect(branches[2].querySelectorAll(".commit")).toHaveLength(5);
  });
});
