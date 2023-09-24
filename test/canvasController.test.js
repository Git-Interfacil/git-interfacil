/* eslint-disable no-undef */
const { drawLine, drawCommit } = require("../src/canvasController.js");

const ctxMock = {
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
};

describe("canvasController", () => {
  it("should call drawLine correctly", () => {
    drawLine(ctxMock, { x: 10, y: 10 }, { x: 20, y: 20 }, "red");

    expect(ctxMock.beginPath).toBeCalled();
    expect(ctxMock.moveTo).toBeCalledWith(10, 10);
    expect(ctxMock.lineTo).toBeCalledWith(20, 20);
    expect(ctxMock.strokeStyle).toBe("red");
    expect(ctxMock.stroke).toBeCalled();
  });

  it("should call drawCommit correctly with no extra params", () => {
    drawCommit(ctxMock, { x: 10, y: 10 }, "red");

    expect(ctxMock.beginPath).toBeCalled();
    expect(ctxMock.shadowColor).toBe(undefined);
    expect(ctxMock.arc).toBeCalledWith(10, 10, 5, 0, 2 * Math.PI);
    expect(ctxMock.fillStyle).toBe("red");
    expect(ctxMock.fill).toBeCalled();
    expect(ctxMock.strokeStyle).toBe("red");
    expect(ctxMock.stroke).toBeCalled();
    expect(ctxMock.shadowBlur).toBe(0);
  });

  it("should call drawCommit correctly with extra params", () => {
    drawCommit(ctxMock, { x: 10, y: 10 }, "red", 10, true);

    expect(ctxMock.beginPath).toBeCalled();
    expect(ctxMock.shadowColor).toBe("red");
    expect(ctxMock.arc).toBeCalledWith(10, 10, 10, 0, 2 * Math.PI);
    expect(ctxMock.fillStyle).toBe("red");
    expect(ctxMock.fill).toBeCalled();
    expect(ctxMock.strokeStyle).toBe("red");
    expect(ctxMock.stroke).toBeCalled();
    expect(ctxMock.shadowBlur).toBe(0);
  });
});
