const ENEMY_FIREBIRD_DIM = 40;
const ENEMY_FIREBIRD_FRAMES = 2;
const ENEMY_FIREBIRD_SPEED = 3;

enemyFireBirdClass.prototype = new moveDrawClass();

function enemyFireBirdClass(usingStep) {
	this.x = (usingStep.driftX*stepPerc + usingStep.percXMin+
		Math.random()*(usingStep.percXMax-usingStep.percXMin))*canvas.width;
	this.y = -ENEMY_FIREBIRD_DIM;
	this.gotoX = this.x;
	this.gotoY = this.y+300;
	this.frame = Math.floor(Math.random()*ENEMY_FIREBIRD_FRAMES);
	this.speed = ENEMY_FIREBIRD_SPEED;

	this.health = 3;

	this.collW = 20;
	this.collH = ENEMY_FIREBIRD_DIM;

	this.framesTillNextTarget = 40;

	this.drawAngle = Math.PI/2;

	this.move = function() {
		if(this.framesTillNextTarget-- > 0) {
			var movingX = Math.cos(this.drawAngle);
			var movingY = Math.sin(this.drawAngle);
			var towardX = (this.gotoX-this.x);
			var towardY = (this.gotoY-this.y);
			var perpDotProd = -towardY*movingX + towardX*movingY;
			var turnSpeed = 0.02;
			if(perpDotProd<0) {
				this.drawAngle += turnSpeed;	
			} else {
				this.drawAngle -= turnSpeed;
			}
			this.x += Math.cos(this.drawAngle)*this.speed;
			this.y += Math.sin(this.drawAngle)*this.speed;
		} else {
			this.framesTillNextTarget = 10+Math.random()*10;
			this.gotoX = Math.random()*GAME_W ;
			this.gotoY += GAME_H*0.15; // move down further
		}

		if(this.x<0 || this.x>GAME_W || this.y>GAME_H) {
			this.readyToRemove = true;
		}
	}

	this.draw = function() { // splode graphic just as placeholder
		drawAnimFrame("fire bird",this.x,this.y, this.frame, ENEMY_FIREBIRD_DIM,ENEMY_FIREBIRD_DIM);

        if (this.hitFlashFrames) {
            this.hitFlashFrames--;
            context.globalCompositeOperation = "lighter"; // brighten stuff up
            drawAnimFrame("fire bird",this.x,this.y, this.frame, ENEMY_FIREBIRD_DIM,ENEMY_FIREBIRD_DIM);
            drawAnimFrame("fire bird",this.x,this.y, this.frame, ENEMY_FIREBIRD_DIM,ENEMY_FIREBIRD_DIM);
            context.globalCompositeOperation = "source-over"; // restore to default
        }
    

	}
	this.animate = function() {
		if(++this.frame>=ENEMY_FIREBIRD_FRAMES) {
			this.frame = 0;
		}
	}
}