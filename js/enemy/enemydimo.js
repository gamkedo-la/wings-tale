const ENEMY_DIMO_DIM = 123;
const ENEMY_DIMO_FRAMES = 6;

enemyDimoClass.prototype = new moveDrawClass();

function enemyDimoClass(usingStep) {
	this.x = (usingStep.driftX*stepPerc + usingStep.percXMin+
		Math.random()*(usingStep.percXMax-usingStep.percXMin))*canvas.width;
	this.y = -ENEMY_DIMO_DIM;
	this.gotoX = this.x;
	this.gotoY = this.y+100;
	this.frame = Math.floor(Math.random()*ENEMY_DIMO_FRAMES);
	this.speed = usingStep.speed;

	this.health = 6;

	this.collW = 60;
	this.collH = 32;

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
			this.gotoX = this.myTarget.x ;
			this.gotoY = this.myTarget.y;
		}

		if(this.x<0 || this.x>GAME_W || this.y>GAME_H) {
			this.readyToRemove = true;
		}
	}

	this.draw = function() { // splode graphic just as placeholder
		drawAnimFrame("dimo",this.x,this.y, this.frame, ENEMY_DIMO_DIM,ENEMY_DIMO_DIM);
	}
	this.animate = function() {
		if(++this.frame>=ENEMY_DIMO_FRAMES) {
			this.frame = 0;
		}
	}
}