/* eslint-disable no-undef */

const { fetchNewContent } = require("../../../src/screens/Home/renderer.js");

const mockWorkspaces = jest.fn();
const mockShortcuts = jest.fn();
const mockHelp = jest.fn();

jest.mock("../../../src/screens/Home/renderer.js", () => ({
  fetchNewContent: jest.fn((pageName) => {
    if (pageName === "workspaces") {
      mockWorkspaces();
    } else if (pageName === "shortcuts") {
      mockShortcuts();
    } else if (pageName === "help") {
      mockHelp();
    } else {
      console.error("Page doesn't exist");
    }
  }),
}));

/* let mockButtons;

beforeEach(() => {
  mockButtons = [
    {
      classList: {
        remove: jest.fn(),
        add: jest.fn(),
      },
      addEventListener: jest.fn(),
      querySelector: jest.fn(() => ({
        textContent: "Button Title",
      })),
    },
    {
      classList: {
        remove: jest.fn(),
        add: jest.fn(),
      },
      addEventListener: jest.fn(),
      querySelector: jest.fn(() => ({
        textContent: "Another Button Title",
      })),
    },
  ];
}); */

describe("HomeController", () => {
  it("fetchNewContent should call the correct controller based on pageName", () => {
    fetchNewContent("workspaces");
    expect(mockWorkspaces).toHaveBeenCalled();

    fetchNewContent("shortcuts");
    expect(mockShortcuts).toHaveBeenCalled();

    fetchNewContent("help");
    expect(mockHelp).toHaveBeenCalled();

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    fetchNewContent("nonExistentPage");
    expect(consoleErrorSpy).toHaveBeenCalledWith("Page doesn't exist");
  });

  /* it('addEvenetListenerButtons should attach click event listeners to buttons', () => {
    // Call the function and pass the mocked buttons
    addEventListenerButtons(mockButtons);

    // Check if addEventListener was called for each button
    mockButtons.forEach((button) => {
      expect(button.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });
  });

  it('click event on a button should trigger expected behavior', () => {
    // Call the function and pass the mocked buttons
    addEventListenerButtons(mockButtons);

    // Assuming one button is clicked
    const clickedButton = mockButtons[0];

    // Simulate a click event on the clicked button
    const clickEventCallback = clickedButton.addEventListener.mock.calls[0][1];
    clickEventCallback();

    // Check if the expected methods were called with the correct arguments
    expect(clickedButton.classList.remove).toHaveBeenCalledWith('selected');
    expect(clickedButton.classList.add).toHaveBeenCalledWith('selected');

    expect(clickedButton.querySelector).toHaveBeenCalledWith('.title');
    expect(fetchNewContent).toHaveBeenCalledWith('button title'); // Replace with expected title

    // Add more specific assertions based on your function's behavior
  }
  );
  */
});
