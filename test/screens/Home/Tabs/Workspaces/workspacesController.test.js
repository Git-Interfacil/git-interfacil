/* eslint-disable no-undef */

const {
  addEventListenerFavorite,
  getTimeAgoString,
  updateTimestamps,
  setFavorite,
} = require("../../../../../src/screens/Home/Tabs/Workspaces/workspacesController.js");

class TextEncoderMock {
  encode(str) {
    return Buffer.from(str, "utf-8");
  }
}
global.TextEncoder = TextEncoderMock;

// Mock TextDecoder
class TextDecoderMock {
  decode(buffer) {
    return buffer.toString("utf-8");
  }
}
global.TextDecoder = TextDecoderMock;
const { JSDOM } = require("jsdom");

describe("addEventListenerFavorite function", () => {
  let button;

  beforeEach(() => {
    button = document.createElement("button");
    button.setAttribute("data-tooltip", "Test Tooltip");
    document.body.appendChild(button);
  });

  afterEach(() => {
    document.body.removeChild(button);
    jest.clearAllMocks();
  });

  it("should display tooltip on mousemove", () => {
    const event = new MouseEvent("mousemove", {
      clientX: 100,
      clientY: 200,
    });

    addEventListenerFavorite(button);
    button.dispatchEvent(event);

    const tooltip = document.querySelector(".tooltip");
    expect(tooltip).toBeTruthy();
    expect(tooltip.textContent).toBe("Test Tooltip");
    expect(tooltip.style.top).toBe("215px");
    expect(tooltip.style.left).toBe("100px");
  });

  it("should remove tooltip on mouseout", () => {
    addEventListenerFavorite(button);
    button.dispatchEvent(new MouseEvent("mouseout"));

    const tooltip = document.querySelector(".tooltip");
    expect(tooltip).toBeNull();
  });
});

describe("getTimeAgoString function", () => {
  it('should return "Just now" for time difference less than a minute', () => {
    const timeString = getTimeAgoString(30 * 1000); // 30 seconds
    expect(timeString).toBe("Just now");
  });

  it('should return "1 minute ago" for time difference of 1 minute', () => {
    const timeString = getTimeAgoString(60 * 1000); // 1 minute
    expect(timeString).toBe("1 minute ago");
  });

  it('should return "X minutes ago" for time difference in minutes', () => {
    const timeString = getTimeAgoString(125 * 1000); // 2 minutes and 5 seconds
    expect(timeString).toBe("2 minutes ago");
  });

  it('should return "1 hour ago" for time difference of 1 hour', () => {
    const timeString = getTimeAgoString(60 * 60 * 1000); // 1 hour
    expect(timeString).toBe("1 hour ago");
  });

  it('should return "X hours ago" for time difference in hours', () => {
    const timeString = getTimeAgoString(3 * 60 * 60 * 1000); // 3 hours
    expect(timeString).toBe("3 hours ago");
  });

  it('should return "1 day ago" for time difference of 1 day', () => {
    const timeString = getTimeAgoString(24 * 60 * 60 * 1000); // 1 day
    expect(timeString).toBe("1 day ago");
  });

  it('should return "X days ago" for time difference in days', () => {
    const timeString = getTimeAgoString(5 * 24 * 60 * 60 * 1000); // 5 days
    expect(timeString).toBe("5 days ago");
  });
});

describe("updateTimestamps function", () => {
  let document;

  beforeEach(() => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago

    const dom = new JSDOM(`
    <body>
      <table>
        <tr>
          <td class="timestamp" data-last-clicked="${new Date()}">
            <span class="lastUpdatedTime"></span>
          </td>
          <td class="timestamp" data-last-clicked="${twoHoursAgo}">
            <span class="lastUpdatedTime"></span>
          </td>
          <td class="timestamp" data-last-clicked="${threeDaysAgo}">
            <span class="lastUpdatedTime"></span>
          </td>
        </tr>
      </table>
    </body>
  `);

    document = dom.window.document;
    document
      .querySelectorAll(".lastUpdatedTime")
      .forEach((el) => (el.textContent = "initial value"));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("updates timestamps correctly", () => {
    updateTimestamps(document);

    const timestampCells = document.querySelectorAll(".timestamp");

    expect(timestampCells[0].textContent.trim()).toBe("Just now");
    expect(timestampCells[1].textContent.trim()).toBe("2 hours ago");
    expect(timestampCells[2].textContent.trim()).toBe("3 days ago");
  });
});

describe("setFavorite function", () => {
  let favoriteCell;

  beforeEach(() => {
    favoriteCell = document.createElement("div");
    favoriteCell.setAttribute("class", "favorite");
    favoriteCell.setAttribute("data-tooltip", "Remove from favorites");
  });

  it("toggles from favorite to not-favorite", () => {
    setFavorite(favoriteCell);

    expect(favoriteCell.className).toBe("not-favorite");
    expect(favoriteCell.getAttribute("data-tooltip")).toBe("Add to favorites");
  });

  it("toggles from not-favorite to favorite", () => {
    favoriteCell.className = "not-favorite";
    favoriteCell.setAttribute("data-tooltip", "Add to favorites");

    setFavorite(favoriteCell);

    expect(favoriteCell.className).toBe("favorite");
    expect(favoriteCell.getAttribute("data-tooltip")).toBe(
      "Remove from favorites",
    );
  });
});
