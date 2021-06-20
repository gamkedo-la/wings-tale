const ENEMY_SWOOP_DIM = 10;
const ENEMY_SWOOP_FRAMES = 2;
const ENEMY_SWOOP_SPEED = 0.4;
const ENEMY_SWOOP_SPEED_DECAY = 0.99;

enemySwoopAtClass.prototype = new moveDrawClass();

function enemySwoopAtClass(usingStep) {
	this.x = (usingStep.driftX*stepPerc + usingStep.percXMin+
		Math.random()*(usingStep.percXMax-usingStep.percXMin))*canvas.width;
	this.y = -ENEMY_SWOOP_DIM;
	this.xv = 0;
	this.yv = 0;
	this.frame = Math.floor(Math.random()*ENEMY_FRAMES);

	this.myTarget;
	if(twoPlayerGame == false) {
		this.myTarget = playerList[0];
	} else {
		var dist1 = approxDist(this.x,this.y,playerList[0].x,playerList[0].y)
		var dist2 = approxDist(this.x,this.y,playerList[1].x,playerList[1].y)
		this.myTarget = (dist1 < dist2 ? playerList[0] : playerList[1]);
	}

	this.move = function() {
		var angAt = Math.atan2(this.myTarget.y-this.y,this.myTarget.x-this.x);
		this.xv *= ENEMY_SWOOP_SPEED_DECAY;
		this.yv *= ENEMY_SWOOP_SPEED_DECAY;
		this.xv += Math.cos(angAt)*ENEMY_SWOOP_SPEED;
		this.yv += Math.sin(angAt)*ENEMY_SWOOP_SPEED;
		this.x += this.xv;
		this.y += this.yv;
		if(this.x<0 || this.x>GAME_W || this.y>GAME_H) {
			this.readyToRemove = true;
		}
	}

	this.draw = function() { // splode graphic just as placeholder
		drawAnimFrame("swoop",this.x,this.y, this.frame, ENEMY_SWOOP_DIM,ENEMY_SWOOP_DIM);
	}
	this.animate = function() {
		if(++this.frame>=ENEMY_SWOOP_FRAMES) {
			this.frame = 0;
		}
	}
}