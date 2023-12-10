const Position = require("./position.js");

class Commit {
  #id;
  #message;
  #createdAt;
  #branchId;
  #parents;
  #author;
  #color;
  #position;

  constructor(
    id,
    message,
    createdAt,
    branchId,
    parents,
    author,
    color = undefined,
    position = new Position(),
  ) {
    this.#id = id;
    this.#message = message;
    this.#createdAt = createdAt;
    this.#branchId = branchId;
    this.#parents = parents;
    this.#author = author;
    this.#color = color;
    this.#position = position;
  }

  get id() {
    return this.#id;
  }

  get message() {
    return this.#message;
  }

  get createdAt() {
    return this.#createdAt;
  }

  get branchId() {
    return this.#branchId;
  }

  get parents() {
    return this.#parents;
  }

  get author() {
    return this.#author;
  }

  get color() {
    return this.#color;
  }

  get position() {
    return this.#position.get_obj_position();
  }

  set position_x(x) {
    this.#position.x = x;
  }

  set position_y(y) {
    this.#position.y = y;
  }

  set color(newColor) {
    this.#color = newColor;
  }

  set message(newMessage) {
    this.#message = newMessage;
  }
}

module.exports = Commit;
