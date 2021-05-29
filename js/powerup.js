var powerupList=[];
const POWERUP_W = 10;
const POWERUP_H = 12;
const POWERUP_FRAMES = 2;
const POWERUP_SPEED = 1;

powerupClass.prototype = new moveDrawClass();

 // note: not yet generalized for more than one kind of powerup
function powerupClass(atX,atY) {
	this.x = atX;
	this.y = atY;
	this.frame = Math.floor(Math.random()*POWERUP_FRAMES);
	this.readyToRemove = false;

	var ang = randAng();
	this.xv = Math.cos(ang) * POWERUP_SPEED;
	this.yv = Math.sin(ang) * POWERUP_SPEED;

	this.move = function() {
		this.x += this.xv;
		this.y += this.yv;
		if(this.y < 0 || this.x < 0 || this.x > GAME_W || this.y > GAME_H) {
			this.readyToRemove = true;
		}
	}

	this.draw = function() {
		drawAnimFrame("powerup",this.x,this.y, this.frame, POWERUP_W,POWERUP_H);
	}
	this.animate = function() {
		if(++this.frame>=POWERUP_FRAMES) {
			this.frame = 0;
		}
	}
}