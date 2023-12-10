/* eslint-disable no-undef */
const CanvasController = require("../../../../src/screens/Repository/controllers/canvasController.js");

const ctxMock = {
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
};

const canvasMock = {
  height: 0,
  width: 0,
  getContext: () => ctxMock,
  addEventListener: jest.fn(),
};

describe("CanvasController", () => {
  const canvasController = new CanvasController(canvasMock);
  it("should call drawLine correctly", () => {
    canvasController.drawLine({ x: 10, y: 10 }, { x: 20, y: 20 }, "red");

    expect(ctxMock.beginPath).toBeCalled();
    expect(ctxMock.moveTo).toBeCalledWith(10, 10);
    expect(ctxMock.lineTo).toBeCalledWith(20, 20);
    expect(ctxMock.strokeStyle).toBe("red");
    expect(ctxMock.stroke).toBeCalled();
  });

  it("should call drawCommit correctly with no extra params", () => {
    canvasController.drawCommit({ x: 10, y: 10 }, "red");

    expect(ctxMock.beginPath).toBeCalled();
    expect(ctxMock.shadowColor).toBe(undefined);
    expect(ctxMock.arc).toBeCalledWith(10, 10, 5, 0, 2 * Math.PI);
    expect(ctxMock.fillStyle).toBe("red");
    expect(ctxMock.fill).toBeCalled();
    expect(ctxMock.strokeStyle).toBe("red");
    expect(ctxMock.stroke).toBeCalled();
    expect(ctxMock.shadowBlur).toBe(0);
    expect(canvasMock.addEventListener).toBeCalled();
  });

  it("should call drawCommit correctly if is head", () => {
    canvasController.drawCommit({ x: 10, y: 10 }, "red", true);

    expect(ctxMock.beginPath).toBeCalled();
    expect(ctxMock.shadowColor).toBe("red");
    expect(ctxMock.arc).toBeCalledWith(10, 10, 8, 0, 2 * Math.PI);
    expect(ctxMock.fillStyle).toBe("red");
    expect(ctxMock.fill).toBeCalled();
    expect(ctxMock.strokeStyle).toBe("red");
    expect(ctxMock.stroke).toBeCalled();
    expect(ctxMock.shadowBlur).toBe(0);
    expect(canvasMock.addEventListener).toBeCalled();
  });

  it("should call setDimensions correctly", () => {
    canvasController.setDimensions(120, 240);

    expect(canvasMock.width).toBe(120);
    expect(canvasMock.height).toBe(240);
  });

  it("should call clearCanvas correctly", () => {
    canvasController.clearCanvas();

    expect(ctxMock.clearRect).toBeCalledWith(0, 0, 120, 240);
  });
});
