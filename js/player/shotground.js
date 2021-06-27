var shotGroundList=[];
const SHOT_GROUND_DIM=5;
const SHOT_GROUND_SPEED=10;
const PLAYER_SHOT_GROUND_FRAMES = 4;
const SHOT_GROUND_SPEED_PERC_FALLOFF = 0.87;
const SHOT_GROUND_SPEED_DETONATE = -0.1;

const BOMB_RADIUS = 28;
const BOMB_EXPLOSIONS = 10;
const APPROX_BOMB_RANGE = 95;
// non-square to compensate for rectangular NES pixels (240x255 resolution stretched to 4:3 display)
const BOMB_FRAME_W = 40;
const BOMB_FRAME_H = 50;

shotGroundClass.prototype = new moveDrawClass();

// px+4,py,SHOT_SPEED,5.0,pmx,pmy
function shotGroundClass(startX,startY, totalSpeed, angle, momentumX,momentumY, isHoming) {
	this.ang = degToShipRad(angle);
	this.x = startX+Math.cos(this.ang)*12; // for lateral spacing when there's a spread
	this.y = startY;
	this.xv = momentumX + Math.cos(this.ang)*totalSpeed;
	this.yv = momentumY + Math.sin(this.ang)*totalSpeed;
	this.homingTarget = null;
	if(isHoming) {
		var bestDist = GAME_W;
		for(var i=0;i<surfaceList.length;i++) {
			if(surfaceList[i].bombLockedOn == false) {
				var compareDist = approxDist(this.x,this.y,surfaceList[i].x,surfaceList[i].y)
				if(bestDist > compareDist) {
					bestDist = compareDist;
					this.homingTarget = surfaceList[i];
				} // end of closest found yet if
			} // end of not locked to yet
		} // end of each target considered
		if(this.homingTarget) {
			this.homingTarget.bombLockedOn = true;
		}
	} // end of homing target search

	this.move = function() {
		if(this.homingTarget != null) {
			if(this.homingTarget.readyToRemove) {
				this.homingTarget = null;
			} else {		
				var angAt = Math.atan2((this.homingTarget.y - startY), (this.homingTarget.x - startX));
				if ( approxDist(this.x,this.y,this.homingTarget.x,this.homingTarget.y) < BOMB_RADIUS ) { // near, drop faster
					this.xv *= SHOT_GROUND_SPEED_PERC_FALLOFF;
					this.yv *= SHOT_GROUND_SPEED_PERC_FALLOFF;
				} else {
					this.xv=Math.cos(angAt);
					this.yv=Math.sin(angAt);
				}
			}
		}
		this.x += this.xv;
		this.y += this.yv;
		this.xv *= SHOT_GROUND_SPEED_PERC_FALLOFF;
		this.yv *= SHOT_GROUND_SPEED_PERC_FALLOFF;
		if(this.y<0 || this.x<0 || this.x>GAME_W || this.y>GAME_H) {
			this.readyToRemove = true;
		} else if(this.yv >= SHOT_GROUND_SPEED_DETONATE) {
			for(var i=0; i<BOMB_EXPLOSIONS; i++) {
				var blastAng = randAng();
				var blastDist = randRange(3,BOMB_RADIUS);

				spawnSplode(this.x + Math.cos(blastAng)*blastDist,this.y + Math.sin(blastAng)*blastDist, true);
			}
			listCollideRangeOfPoint(surfaceList, this.x, this.y, BOMB_RADIUS, function (at) { 
						if(Math.random() < GROUND_POWERUP_DROP_PERCENT) {
							powerupList.push(new powerupClass(at.x,at.y));
						}
					} );
			this.readyToRemove = true;
		}
	}

	this.draw = function() {
		var frameNow = (PLAYER_SHOT_GROUND_FRAMES-1)-Math.floor( (-this.yv/SHOT_GROUND_SPEED) * PLAYER_SHOT_GROUND_FRAMES);
		drawAnimFrame("player shot ground",this.x,this.y, frameNow, SHOT_GROUND_DIM,SHOT_GROUND_DIM);
	}
}