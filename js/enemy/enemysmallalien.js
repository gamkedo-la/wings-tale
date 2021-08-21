const ENEMY_SMALLALIEN_DIM = 24;
const ENEMY_SMALLALIEN_FRAMES = 3;

enemySmallAlienClass.prototype = new moveDrawClass();

function enemySmallAlienClass(usingStep) {
	this.x = (usingStep.driftX*stepPerc + usingStep.percXMin+
		Math.random()*(usingStep.percXMax-usingStep.percXMin))*canvas.width;
	this.y = -ENEMY_SMALLALIEN_DIM;
	this.gotoX = this.x;
	this.gotoY = this.y+100;
	this.frame = Math.floor(Math.random()*ENEMY_SMALLALIEN_FRAMES);
	this.speed = usingStep.speed;

	this.collDim = ENEMY_SMALLALIEN_DIM;

	this.myTarget;
	if(twoPlayerGame == false) {
		this.myTarget = playerList[0];
	} else { // pick random target
		this.myTarget = (Math.random()<0.5 ? playerList[0] : playerList[1]);
	}

	this.move = function() {
		var distToGoto = approxDist(this.x,this.y,this.gotoX, this.gotoY);
		
		if(distToGoto > this.speed) {
			var angAt = Math.atan2(this.gotoY-this.y,this.gotoX-this.x);
			this.x += Math.cos(angAt)*this.speed;
			this.y += Math.sin(angAt)*this.speed;
		} else {
			this.gotoX = this.myTarget.x;
			this.gotoY = this.myTarget.y;
		}

		if(this.x<0 || this.x>GAME_W || this.y>GAME_H) {
			this.readyToRemove = true;
		}
	}

	this.draw = function() { // splode graphic just as placeholder
		drawAnimFrame("smallalien",this.x,this.y, this.frame, ENEMY_SMALLALIEN_DIM,ENEMY_SMALLALIEN_DIM);
	}
	this.animate = function() {
		if(++this.frame>=ENEMY_SMALLALIEN_FRAMES) {
			this.frame = 0;
		}
	}
}