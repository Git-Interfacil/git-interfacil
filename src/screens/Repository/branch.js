const Position = require("./position");

class Branch {
  #id;
  #position;
  #color;

  constructor(id, position, color) {
    if (!position.x || !position.y) {
      throw new Error("Position must have x and y");
    }

    this.#id = id;
    this.#position = new Position(position.x, position.y);
    this.#color = color;
  }

  get id() {
    return this.#id;
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

  get color() {
    return this.#color;
  }

  changeColor(color) {
    this.#color = color;
  }

  setPosition(position) {
    this.#position = position;
  }
}

module.exports = Branch;
