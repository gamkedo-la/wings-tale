var shotList=[];
const SHOT_DIM=3;
const SHOT_SPEED=6;
var playerShotCommonFrame = 0;
const PLAYER_SHOT_FRAMES = 4;

function animateShots() {
	// special case, not using animateList for shots so they all stay in sync
	if(++playerShotCommonFrame>=PLAYER_SHOT_FRAMES) {
		playerShotCommonFrame = 0;
	}
}

shotClass.prototype = new moveDrawClass();

// px+4,py,SHOT_SPEED,5.0,pmx,pmy
function shotClass(startX,startY, totalSpeed, angle, momentumX,momentumY) {
	this.ang = degToShipRad(angle);
	this.x = startX+Math.cos(this.ang)*12; // for lateral spacing when there's a spread
	this.y = startY;
	this.xv = momentumX + Math.cos(this.ang)*totalSpeed;
	this.yv = momentumY + Math.sin(this.ang)*totalSpeed;

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