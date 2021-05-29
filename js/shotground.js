var shotGroundList=[];
const SHOT_GROUND_DIM=5;
const SHOT_GROUND_SPEED=10;
const PLAYER_SHOT_GROUND_FRAMES = 4;
const SHOT_GROUND_SPEED_PERC_FALLOFF = 0.9;
const SHOT_SPEED_DETONATE = -0.1;

shotGroundClass.prototype = new moveDrawClass();

// px+4,py,SHOT_SPEED,5.0,pmx,pmy
function shotGroundClass(startX,startY, totalSpeed, angle, momentumX,momentumY) {
	this.ang = degToShipRad(angle);
	this.x = startX+Math.cos(this.ang)*12; // for lateral spacing when there's a spread
	this.y = startY;
	this.xv = momentumX + Math.cos(this.ang)*totalSpeed;
	this.yv = momentumY + Math.sin(this.ang)*totalSpeed;

	this.move = function() {
		this.x += this.xv;
		this.y += this.yv;
		this.yv *= SHOT_GROUND_SPEED_PERC_FALLOFF;
		if(this.y<0 || this.x<0 || this.x>GAME_W || this.y>GAME_H) {
			this.readyToRemove = true;
		} else if(this.yv >= SHOT_SPEED_DETONATE) {
			spawnSplode(this.x,this.y);
			this.readyToRemove = true;
		}
	}

	this.draw = function() {
		var frameNow = (PLAYER_SHOT_GROUND_FRAMES-1)-Math.floor( (-this.yv/SHOT_GROUND_SPEED) * PLAYER_SHOT_GROUND_FRAMES);
		drawAnimFrame("player shot ground",this.x,this.y, frameNow, SHOT_GROUND_DIM,SHOT_GROUND_DIM);
	}
}