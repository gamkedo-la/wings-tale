const ENEMY_SHOCKBALL_DIM = 24;
const ENEMY_SHOCKBALL_FRAMES = 3;
const ENEMY_SHOCKBALL_SPEED = 7;

enemyShockBallClass.prototype = new moveDrawClass();

function enemyShockBallClass(usingStep) {
	this.x = (usingStep.driftX*stepPerc + usingStep.percXMin+
		Math.random()*(usingStep.percXMax-usingStep.percXMin))*canvas.width;
	this.y = -ENEMY_SHOCKBALL_DIM;
	this.gotoX = this.x;
	this.gotoY = this.y+100;
	this.frame = Math.floor(Math.random()*ENEMY_SHOCKBALL_FRAMES);

	this.collW = this.collH = ENEMY_SHOCKBALL_DIM;

	this.move = function() {
		var distToGoto = approxDist(this.x,this.y,this.gotoX, this.gotoY);
		
		if(distToGoto > ENEMY_SHOCKBALL_SPEED) {
			var angAt = Math.atan2(this.gotoY-this.y,this.gotoX-this.x);
			this.x += Math.cos(angAt)*ENEMY_SHOCKBALL_SPEED;
			this.y += Math.sin(angAt)*ENEMY_SHOCKBALL_SPEED;
		} else {
			this.gotoX = Math.random()*GAME_W;
			this.gotoY = Math.random()*GAME_H;
		}

		if(this.x<0 || this.x>GAME_W || this.y>GAME_H) {
			this.readyToRemove = true;
		}
	}

	this.draw = function() { // splode graphic just as placeholder
		drawAnimFrame("shockball",this.x,this.y, this.frame, ENEMY_SHOCKBALL_DIM,ENEMY_SHOCKBALL_DIM);
	}
	this.animate = function() {
		if(++this.frame>=ENEMY_SHOCKBALL_FRAMES) {
			this.frame = 0;
		}
	}
}