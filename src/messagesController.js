function createMessage(message, author, color) {
  const li = document.createElement("li");

  const spanMessage = document.createElement("span");
  spanMessage.classList.add("message");
  spanMessage.innerText = message;
  li.appendChild(spanMessage);

  const spanAuthor = document.createElement("span");
  spanAuthor.innerText = author;
  spanAuthor.classList.add("author");
  li.appendChild(spanAuthor);

  li.style.borderColor = color;

  return li;
}

module.exports = {
  createMessage,
};
