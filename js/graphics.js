var debug_showHiddenCanvas = false;

const GAME_W = 256;
const GAME_H = 240;

// note: 3:4 even though the game resolution isn't. same as on NES
const SCALED_W = 800;
const SCALED_H = 600;

const W_RATIO = GAME_W / SCALED_W;
const H_RATIO = GAME_H / SCALED_H;


const TARGET_MOTION_FPS = 30;
const SHARED_ANIMATION_FRAMES_PER_SEC = 8;

var scaledCanvas, scaledCtx;
var canvas, context;
var fxCanvas, fxContext;


function drawAnimFrame(picName,atX,atY, whichFrame, frameW,frameH,optionalRow) {
	var offsetY;
	if (typeof optionalRow !== 'undefined') {
		offsetY = frameH * optionalRow;
	} else {
		offsetY = 0;
	}
	context.drawImage(images[picName],whichFrame * frameW,offsetY,frameW,frameH,
									  atX-frameW/2,atY-frameH/2,frameW,frameH);
}

function startDisplayIntervals() {
	setInterval(update,1000/TARGET_MOTION_FPS);
	setInterval(animateSprites, 1000/SHARED_ANIMATION_FRAMES_PER_SEC);
}

function setupCanvas() {
	scaledCanvas = document.getElementById('showCanvas');
	scaledCanvas.width=SCALED_W;
	scaledCanvas.height=SCALED_H;
	scaledCtx=scaledCanvas.getContext("2d");
	
	canvas=document.createElement("canvas");
	canvas.width=GAME_W;
	canvas.height=GAME_H;
	context=canvas.getContext("2d");

	fxCanvas=document.createElement("canvas");
	fxCanvas.style.display="none";
	fxCanvas.width=GAME_W;
	fxCanvas.height=GAME_H;
	fxContext=fxCanvas.getContext("2d");

	context.mozImageSmoothingEnabled = false;
	context.imageSmoothingEnabled = false;
	context.msImageSmoothingEnabled = false;
	scaledCtx.mozImageSmoothingEnabled = false;
	scaledCtx.imageSmoothingEnabled = false;
	scaledCtx.msImageSmoothingEnabled = false;
}