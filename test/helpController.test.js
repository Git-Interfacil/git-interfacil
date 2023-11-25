/* eslint-disable no-undef */
const help = require("../src/screens/Home/Tabs/Help/helpController.js");

class TextEncoderMock {
  encode(str) {
    return Buffer.from(str, "utf-8");
  }
}
global.TextEncoder = TextEncoderMock;

class TextDecoderMock {
  decode(buffer) {
    return buffer.toString("utf-8");
  }
}
global.TextDecoder = TextDecoderMock;
const { JSDOM } = require("jsdom");

describe("help function", () => {
  let document;

  beforeEach(() => {
    const dom = new JSDOM(`
       <dl class="faq-section">
       <dt class="question">Q: What is this website about?</dt>
       <dd class="answer">A: This website provides information about...</dd>
     
       <dt class="question">Q: How can I get started?</dt>
       <dd class="answer">A: To get started...</dd>
     
       <dt class="question">Q: Can I modify my account settings?</dt>
       <dd class="answer">A: Yes, you can modify your account settings by...</dd>
     </dl>     
      `);

    document = dom.window.document;
    const questions = document.querySelectorAll(".question");
    help(questions);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("toggles display on click", () => {
    const question = document.querySelector(".question");
    const answer = question.nextElementSibling;

    question.click();

    expect(answer.style.display).toBe("block");

    question.click();

    expect(answer.style.display).toBe("none");
  });
});
