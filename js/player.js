const PLAYER_DIM = 12;
const PLAYER_FRAME_W = 13;
const PLAYER_FRAME_H = 12;
const PLAYER_FRAMES = 3;
const PLAYER_SPEED = 3;
const EDGE_MARGIN = PLAYER_DIM;
const DFRING_RADIUS = 10;
var px, py;
var pxv=0,pyv=0;
var dfRingX, dfRingY;
var dfRingAngle = 0;
var dfRingAngularSpeed = 2;

var playerFrame=0;

var holdLeft=false;
var holdUp=false;
var holdRight=false;
var holdDown=false;
var holdFire=false;
var holdBomb=false;
var wasHoldingBomb=false; // to tell when state toggles, since not repeat fire

function drawPlayer() {
	context.fillStyle="white";
	//context.fillRect(px-PLAYER_DIM/2,py-PLAYER_DIM/2,PLAYER_DIM,PLAYER_DIM);

	drawAnimFrame("player",px,py, playerFrame, PLAYER_FRAME_W,PLAYER_FRAME_H);
	drawAnimFrame("defense_ring_unit", dfRingX, dfRingY, playerFrame, 6, 6);
}

function animatePlayer() {
	playerFrame++;
	if(playerFrame>=PLAYER_FRAMES) {
		playerFrame = 0;
	}
}

function movePlayer() {	
	// input handling
	if(holdUp) {
		pyv = -PLAYER_SPEED;
	}
	if(holdRight) {
		pxv = PLAYER_SPEED;
	}
	if(holdDown) {
		pyv = PLAYER_SPEED;
	}
	if(holdLeft) {
		pxv = -PLAYER_SPEED;
	}

	px += pxv;
	py += pyv;

	pxv*=0.7;
	pyv*=0.7;

	dfRingX = px + DFRING_RADIUS * Math.cos(dfRingAngle);
	dfRingY = py + DFRING_RADIUS * Math.sin(dfRingAngle);

	dfRingAngle+=dfRingAngularSpeed;

	// bounds check
	if(px<EDGE_MARGIN) {
		px=EDGE_MARGIN;
	}
	if(px>=GAME_W-EDGE_MARGIN) {
		px=GAME_W-EDGE_MARGIN-1;
	}
	if(py<EDGE_MARGIN) {
		py=EDGE_MARGIN;
	}
	if(py>=GAME_H-EDGE_MARGIN) {
		py=GAME_H-EDGE_MARGIN-1;
	}


	if(holdBomb && wasHoldingBomb != holdBomb) {
		console.log("Not implemented: ground attack / drop bomb");
	}
	wasHoldingBomb = holdBomb;

	if(holdFire) {
		// pmx = partial momentum x, using part of current player speed to bunch up less
		var pmx = pxv * 0.1;
		var pmy = pyv * (pyv > 0 ? 0.2 : 0.9);

		shotList.push({x:px-4,y:py,xv:pmx-0.087*SHOT_SPEED,yv:pmy-0.996*SHOT_SPEED});
		shotList.push({x:px,y:py-1,xv:pmx+0*SHOT_SPEED,yv:pmy-1*SHOT_SPEED});
		shotList.push({x:px+4,y:py,xv:pmx+0.087*SHOT_SPEED,yv:pmy-0.996*SHOT_SPEED});
	}
}