class Position {
  #x;
  #y;

  constructor(x = undefined, y = undefined) {
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  set x(x) {
    this.#x = x;
  }

  set y(y) {
    this.#y = y;
  }

  set_position(x, y) {
    this.#x = x;
    this.#y = y;
  }

  get_obj_position() {
    return {
      x: this.#x,
      y: this.#y,
    };
  }
}

module.exports = Position;
