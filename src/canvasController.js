class CanvasController {
  #canvas;
  #ctx;

  constructor(canvas) {
    if (!canvas) throw Error("No canvas found");
    this.#canvas = canvas;
    this.#ctx = canvas.getContext("2d");
    if (!this.#ctx) throw Error("No 2d context found");
  }

  setDimensions(width, height) {
    this.#canvas.width = width;
    this.#canvas.height = height;
  }

  clearCanvas() {
    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
  }

  drawBezierCurve = (start, end, intensity, color) => {
    this.#ctx.beginPath();
    this.#ctx.moveTo(start.x, start.y);
    this.#ctx.bezierCurveTo(
      end.x,
      start.y + intensity,
      start.x,
      end.y - intensity,
      end.x,
      end.y,
    );
    this.#ctx.strokeStyle = color;
    this.#ctx.lineWidth = 2;
    this.#ctx.stroke();
  };

  drawLine = (start, end, color) => {
    this.#ctx.beginPath();
    this.#ctx.moveTo(start.x, start.y);
    this.#ctx.lineTo(end.x, end.y);
    this.#ctx.strokeStyle = color;
    this.#ctx.stroke();
  };

  drawCommit = (position, color, isHead = false) => {
    const size = isHead ? 8 : 5;
    this.#ctx.beginPath();
    if (isHead) {
      this.#ctx.shadowBlur = 20;
      this.#ctx.shadowColor = color;
    }
    this.#ctx.arc(position.x, position.y, size, 0, 2 * Math.PI);
    this.#ctx.fillStyle = color;
    this.#ctx.fill();
    this.#ctx.lineWidth = 5;
    this.#ctx.strokeStyle = color;
    this.#ctx.stroke();
    this.#ctx.shadowBlur = 0;

    this.#canvas.addEventListener("click", (event) => {
      const rect = this.#canvas.getBoundingClientRect();
      const x = event.x - rect.left;
      const y = event.y - rect.top;
      const commitClicked =
        x >= position.x - 10 &&
        x <= position.x + 10 &&
        y >= position.y - 10 &&
        y <= position.y + 10;
      if (commitClicked)
        console.log(`Clicou no commit com pos ${position.x}, ${position.y}`);
    });
  };
}

module.exports = CanvasController;
