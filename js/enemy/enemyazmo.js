const ENEMY_AZMO_DIM = 75;
const ENEMY_AZMO_FRAMES = 5;

enemyAzmoClass.prototype = new moveDrawClass();

function enemyAzmoClass(usingStep) {
	this.x = (usingStep.driftX*stepPerc + usingStep.percXMin+
		Math.random()*(usingStep.percXMax-usingStep.percXMin))*canvas.width;
	this.y = -ENEMY_AZMO_DIM;
	this.gotoX = this.x;
	this.gotoY = this.y+100;
	this.frame = Math.floor(Math.random()*ENEMY_AZMO_FRAMES);
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
		drawAnimFrame("azmo",this.x,this.y, this.frame, ENEMY_AZMO_DIM,ENEMY_AZMO_DIM);

        if (this.hitFlashFrames) {
            //console.log("flashing azmo!");
            this.hitFlashFrames--;
            context.globalCompositeOperation = "lighter"; // brighten stuff up
            drawAnimFrame("azmo",this.x,this.y, this.frame, ENEMY_AZMO_DIM,ENEMY_AZMO_DIM);
            drawAnimFrame("azmo",this.x,this.y, this.frame, ENEMY_AZMO_DIM,ENEMY_AZMO_DIM);
            context.globalCompositeOperation = "source-over"; // restore to default
        }
    

	}
	this.animate = function() {
		if(++this.frame>=ENEMY_AZMO_FRAMES) {
			this.frame = 0;
		}
	}
}