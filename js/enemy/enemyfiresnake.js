const ENEMY_FIRESNAKE_DIM = 40;
const ENEMY_FIRESNAKE_FRAMES = 2;
const ENEMY_FIRESNAKE_SPEED = 2;

enemyFireSnakeClass.prototype = new moveDrawClass();

function enemyFireSnakeClass(usingStep) {
	this.x = (usingStep.driftX*stepPerc + usingStep.percXMin+
		Math.random()*(usingStep.percXMax-usingStep.percXMin))*canvas.width;
	this.y = -ENEMY_FIRESNAKE_DIM;
	this.gotoX = this.x;
	this.gotoY = this.y+300;
	this.frame = Math.floor(Math.random()*ENEMY_FIRESNAKE_FRAMES);
	this.speed = ENEMY_FIRESNAKE_SPEED;

	this.health = 2;

	this.collW = 30;
	this.collH = ENEMY_FIRESNAKE_DIM;

	this.framesTillNextTarget = 40;

	this.drawAngle = Math.PI/2;

	this.move = function() {
		if(this.framesTillNextTarget-- > 0) {
			var movingX = Math.cos(this.drawAngle);
			var movingY = Math.sin(this.drawAngle);
			var towardX = (this.gotoX-this.x);
			var towardY = (this.gotoY-this.y);
			var perpDotProd = -towardY*movingX + towardX*movingY;
			var turnSpeed = 0.03;
			if(perpDotProd<0) {
				this.drawAngle += turnSpeed;	
			} else {
				this.drawAngle -= turnSpeed;
			}
			this.x += Math.cos(this.drawAngle)*this.speed;
			this.y += Math.sin(this.drawAngle)*this.speed;
		} else {
			this.framesTillNextTarget = 40;
			this.gotoX = Math.random()*GAME_W ;
			this.gotoY = Math.random()*GAME_H;
		}

		if(this.x<0 || this.x>GAME_W || this.y>GAME_H) {
			this.readyToRemove = true;
		}
	}

	this.draw = function() { // splode graphic just as placeholder
		drawAnimFrame("fire snake",this.x,this.y, this.frame, ENEMY_FIRESNAKE_DIM,ENEMY_FIRESNAKE_DIM,this.drawAngle);

        if (this.hitFlashFrames) {
            this.hitFlashFrames--;
            context.globalCompositeOperation = "lighter"; // brighten stuff up
            drawAnimFrame("fire snake",this.x,this.y, this.frame, ENEMY_FIRESNAKE_DIM,ENEMY_FIRESNAKE_DIM,this.drawAngle);
            drawAnimFrame("fire snake",this.x,this.y, this.frame, ENEMY_FIRESNAKE_DIM,ENEMY_FIRESNAKE_DIM,this.drawAngle);
            context.globalCompositeOperation = "source-over"; // restore to default
        }
    

	}
	this.animate = function() {
		if(++this.frame>=ENEMY_FIRESNAKE_FRAMES) {
			this.frame = 0;
		}
	}
}