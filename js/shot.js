var shotList=[];
const SHOT_DIM=3;
const SHOT_SPEED=6;
var playerShotCommonFrame = 0;
const PLAYER_SHOT_FRAMES = 4;

function drawShots() {
	for(var s=0;s<shotList.length;s++) {
		shotList[s].draw();
	}
}

function moveShots() {
	for(var s=0;s<shotList.length;s++) {
		shotList[s].move();
	}
}

function animateShots() {
	if(++playerShotCommonFrame>=PLAYER_SHOT_FRAMES) {
		playerShotCommonFrame = 0;
	}
}

// to go from -5 to "5 degrees left of player ship facing north"
function degToShipRad(degAng) {
	return ((degAng-90) * Math.PI/180.0);
}

// px+4,py,SHOT_SPEED,5.0,pmx,pmy
function shotClass(startX,startY, totalSpeed, angle, momentumX,momentumY) {
	this.x = startX;
	this.y = startY;
	this.ang = degToShipRad(angle);
	this.xv = momentumX + Math.cos(this.ang)*totalSpeed;
	this.yv = momentumY + Math.sin(this.ang)*totalSpeed;
	this.readyToRemove = false;

	this.move = function() {
		this.x += this.xv;
		this.y += this.yv;
		if(this.y<0 || this.x<0 || this.x>GAME_W || this.y>GAME_H) {
			this.readyToRemove = true;
		}
	}

	this.draw = function() {
		drawAnimFrame("player shot",this.x,this.y, playerShotCommonFrame, SHOT_DIM,SHOT_DIM);
	}
}