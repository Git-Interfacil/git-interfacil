/* eslint-disable no-undef */

const { ipcRenderer } = require("electron");
const {
  separateStringIntoSpans,
  openNewShortcutWindow,
  saveNewShortcut,
  changeButton,
  editShortcut,
} = require("../src/screens/Home/Tabs/shortcutsController.js");

jest.mock("electron", () => ({
  ipcRenderer: {
    send: jest.fn(),
    once: jest.fn((eventName, callback) => {
      if (eventName === "inputValue-updated") {
        callback({}, "Multiple  spaces  here");
      }
    }),
    invoke: jest.fn(),
  },
}));

describe("separateStringIntoSpans function", () => {
  it("should separate a string into spans with + between", () => {
    const inputString = "Hello World";
    const expectedOutput = "<span>Hello</span> + <span>World</span>";

    const result = separateStringIntoSpans(inputString);
    expect(result).toBe(expectedOutput);
  });

  it("should handle empty input and show error box", () => {
    const inputString = "";
    const expectedOutput = "";

    const result = separateStringIntoSpans(inputString);

    expect(result).toBe(expectedOutput);

    expect(ipcRenderer.invoke).toHaveBeenCalledWith(
      "showErrorBox",
      "Keybing required",
    );
  });

  it("should handle single word input", () => {
    const inputString = "Testing";
    const expectedOutput = "<span>Testing</span>";

    const result = separateStringIntoSpans(inputString);
    expect(result).toBe(expectedOutput);
  });

  it("should handle multiple spaces between words", () => {
    const inputString = "Multiple    spaces   here";
    const expectedOutput =
      "<span>Multiple</span> + <span>spaces</span> + <span>here</span>";

    const result = separateStringIntoSpans(inputString);
    expect(result).toBe(expectedOutput);
  });
});

describe("openNewShortcutWindow function", () => {
  let mockKeybindCell;

  beforeEach(() => {
    mockKeybindCell = document.createElement("div");
    mockKeybindCell.innerHTML = "<span></span>";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update keybindCell with formatted text", async () => {
    await openNewShortcutWindow(mockKeybindCell);

    const expectedFormattedText =
      "<span>Multiple</span> + <span>spaces</span> + <span>here</span>";
    expect(mockKeybindCell.querySelector("span").innerHTML).toBe(
      expectedFormattedText,
    );
  });

  it("should handle errors when waiting for updated input value", async () => {
    await openNewShortcutWindow(mockKeybindCell);

    jest.spyOn(global.console, "error");
  });
});

describe("saveNewShortcut function", () => {
  let consoleSpy;

  beforeAll(() => {
    consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  const mockInputField = document.createElement("input");
  const mockCell = document.createElement("td");
  const mockNewRow = document.createElement("tr");
  const mockImage = document.createElement("img");

  mockCell.appendChild(mockImage);
  mockNewRow.appendChild(mockCell);
  mockNewRow.appendChild(mockInputField);

  it("should disable input fields in the newRow and call changeButton", () => {
    jest
      .spyOn(mockNewRow, "querySelectorAll")
      .mockReturnValue([mockInputField]);

    saveNewShortcut(mockNewRow);

    expect(mockInputField.disabled).toBe(true);

    expect(console.warn).toHaveBeenCalled();
  });
});

describe("changeButton function", () => {
  let button;
  let icon;
  let consoleSpy;

  beforeAll(() => {
    consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  beforeEach(() => {
    button = document.createElement("button");
    icon = document.createElement("img");
    button.appendChild(icon);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should change to save mode when class is edit", () => {
    const addEventListenerSpy = jest.spyOn(button, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(button, "removeEventListener");
    button.className = "edit";
    changeButton(button);

    expect(icon.src).toContain("/assets/save-icon.svg");
    expect(removeEventListenerSpy).toHaveBeenCalled();
    expect(addEventListenerSpy).toHaveBeenCalled();
  });

  it("should change to edit mode when class is save", () => {
    const addEventListenerSpy = jest.spyOn(button, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(button, "removeEventListener");
    button.className = "save";
    changeButton(button);

    expect(icon.src).toContain("/assets/edit-icon.svg");
    expect(removeEventListenerSpy).toHaveBeenCalled();
    expect(addEventListenerSpy).toHaveBeenCalled();
  });

  it("should log a warning if class is not found", () => {
    button.className = "unknown";
    const addEventListenerSpy = jest.spyOn(button, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(button, "removeEventListener");
    changeButton(button);

    expect(console.warn).toHaveBeenCalledWith("class not found");
    expect(icon.src).toBe("");
    expect(removeEventListenerSpy).not.toHaveBeenCalled();
    expect(addEventListenerSpy).not.toHaveBeenCalled();
  });

  describe("editShortcut function", () => {
    let consoleSpy;

    beforeAll(() => {
      consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterAll(() => {
      consoleSpy.mockRestore();
    });

    const mockInputField = document.createElement("input");
    const mockCell = document.createElement("td");
    const mockNewRow = document.createElement("tr");
    const mockImage = document.createElement("img");

    mockCell.appendChild(mockImage);
    mockNewRow.appendChild(mockCell);
    mockNewRow.appendChild(mockInputField);

    it("should disable input fields in the newRow and call changeButton", () => {
      jest
        .spyOn(mockNewRow, "querySelectorAll")
        .mockReturnValue([mockInputField]);

      editShortcut(mockNewRow);

      expect(mockInputField.disabled).toBe(false);

      expect(console.warn).toHaveBeenCalled();
    });
  });
});
