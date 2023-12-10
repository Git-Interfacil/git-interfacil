/* eslint-disable no-undef */
const {
  createMessage,
} = require("../src/screens/Repository/messagesController.js");

describe("createMessage", () => {
  it("should create a message element with the given message and author", () => {
    const message = "Pão padaria padeiro";
    const author = "Pantheon";
    const color = "#fff";

    const messageElement = createMessage(message, author, color);

    expect(messageElement).toBeDefined();
    expect(messageElement.tagName).toBe("LI");

    const messageSpan = messageElement.querySelector(".message");
    expect(messageSpan).toBeDefined();
    expect(messageSpan.innerText).toBe(message);

    const authorSpan = messageElement.querySelector(".author");
    expect(authorSpan).toBeDefined();
    expect(authorSpan.innerText).toBe(author);

    expect(messageElement.style.borderColor).toBe(color);
  });

  it("should create message with special characters", () => {
    const message = "<b>Introduz</b> @@@mudanças@@@ no código";
    const author = "João da Silva";
    const color = "#eee";

    const messageElement = createMessage(message, author, color);

    expect(messageElement).toBeDefined();
    expect(messageElement.tagName).toBe("LI");

    const messageSpan = messageElement.querySelector(".message");
    expect(messageSpan).toBeDefined();
    expect(messageSpan.innerText).toBe(message);
  });
});
