const drawLine = (ctx, start, end, color) => {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = color;
  ctx.stroke();
};

const drawCommit = (ctx, position, color, size = 5, glowEffect = false) => {
  ctx.beginPath();
  if (glowEffect) {
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
  }
  ctx.arc(position.x, position.y, size, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.shadowBlur = 0;
};

module.exports = {
  drawCommit,
  drawLine,
};
