var debug_showHiddenCanvas = false;

const GAME_W = 256;
const GAME_H = 240;

// note: 3:4 even though the game resolution isn't. same as on NES
const SCALED_W = 800;
const SCALED_H = 600;

// 40x50 is a circle in this stretch, so 5/4 height
const RATIO_CIRCLE_TALLER = SCALED_W / SCALED_H / (GAME_H / GAME_W);

const W_RATIO = GAME_W / SCALED_W;
const H_RATIO = GAME_H / SCALED_H;

const PARALLAX_OFFSET_X = 83;
const PARALLAX_OFFSET_Y = 85;

const TARGET_MOTION_FPS = 30;
const SHARED_ANIMATION_FRAMES_PER_SEC = 8;

var scaledCanvas, scaledCtx;
var canvas, context;
var fxCanvas, fxContext;
var depthSpawnCanvas, depthSpawnContext, depthSpawnData;

function drawAnimFrame(
  picName,
  atX,
  atY,
  whichFrame,
  frameW,
  frameH,
  angle,
  optionalRow,
  scalePerc
) {
  var offsetY;
  if (typeof optionalRow !== "undefined") {
    offsetY = frameH * optionalRow;
  } else {
    offsetY = 0;
  }
  context.save();
  context.translate(Math.floor(atX), Math.floor(atY));
  if (typeof scalePerc !== "undefined") {
    context.scale(scalePerc, scalePerc);
  }
  if (angle != 0) {
    context.rotate(angle);
  }

  context.drawImage(
    images[picName],
    whichFrame * frameW,
    offsetY,
    frameW,
    frameH,
    -frameW / 2,
    -frameH / 2,
    frameW,
    frameH
  );
  context.restore();
}

function drawFilledBar(cornerX, cornerY, width, height, fillPerc, color) {
  context.beginPath();
  context.fillStyle = color;
  context.strokeStyle = color;
  context.rect(cornerX, cornerY, width, height);
  context.stroke();
  context.fillRect(cornerX, cornerY, width * fillPerc, height);
}

// note: from CENTER not corner (used mainly for editor highlight stuff)
function drawBox(centerX, centerY, sizeFromCenter, color) {
  context.beginPath();
  context.strokeStyle = color;
  context.rect(
    centerX - sizeFromCenter,
    centerY - sizeFromCenter,
    sizeFromCenter * 2,
    sizeFromCenter * 2
  );
  context.stroke();
}

// uses main x/y of the object
function drawColl(collObj, color) {
  context.beginPath();
  context.strokeStyle = color;
  context.rect(
    collObj.x - collObj.collW / 2,
    collObj.y - collObj.collH / 2,
    collObj.collW,
    collObj.collH
  );
  context.stroke();
}
// uses separate collX/collY of the object, mostly added for bosses with moving/separate weakpoints etc.
function drawCollSepCoord(collObj, color) {
  context.beginPath();
  context.strokeStyle = color;
  context.rect(
    collObj.collX - collObj.collW / 2,
    collObj.collY - collObj.collH / 2,
    collObj.collW,
    collObj.collH
  );
  context.stroke();
}

function startDisplayIntervals() {
  setInterval(update, 1000 / TARGET_MOTION_FPS);
  setInterval(animateSprites, 1000 / SHARED_ANIMATION_FRAMES_PER_SEC);
}

function setupCanvas() {
  scaledCanvas = document.getElementById("showCanvas");
  scaledCanvas.width = SCALED_W;
  scaledCanvas.height = SCALED_H;
  scaledCtx = scaledCanvas.getContext("2d");

  canvas = document.createElement("canvas");
  canvas.width = GAME_W;
  canvas.height = GAME_H;
  context = canvas.getContext("2d");

  fxCanvas = document.createElement("canvas");
  fxCanvas.style.display = "none";
  fxCanvas.width = GAME_W;
  fxCanvas.height = GAME_H;
  fxContext = fxCanvas.getContext("2d");

  context.mozImageSmoothingEnabled = false;
  context.imageSmoothingEnabled = false;
  context.msImageSmoothingEnabled = false;
  scaledCtx.mozImageSmoothingEnabled = false;
  scaledCtx.imageSmoothingEnabled = false;
  scaledCtx.msImageSmoothingEnabled = false;
}

function drawBarAsPercentage(width, height, part, whole, x, y, color) {
  var barWidth = width * (part / whole);
  context.fillStyle = color;
  context.fillRect(x, y, barWidth, height);
}

function drawBarWithText(width, height, part, whole, x, y, color) {
  drawBarAsPercentage(width, height, part, whole, x, y, color);

  var healthCount = part + "/" + whole;
  var stringWidth = healthCount.length * pixelfontw + 4;
  var stringHeight = pixelfonth - 1;
  var horizontalPlacement = x + width / 2 - stringWidth / 2;
  var verticalPlacement = y + height / 2 - stringHeight / 2;

  micro_pixel_font(healthCount, horizontalPlacement, verticalPlacement);
}
