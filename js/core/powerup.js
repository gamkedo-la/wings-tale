var powerupList=[];
const POWERUP_W = 10;
const POWERUP_H = 12;
const POWERUP_FRAMES = 2;
const POWER_UP_FRAME_DRAG = 4; // slow down animation framerate
const POWERUP_SPEED = 1;

const POWER_UP_KIND_SHOTS = 0;
const POWER_UP_KIND_BOMB = 1;
const POWER_UP_KIND_GHOST = 2;
const POWERUP_KINDS = 3;
const POWERUP_MOVEMENT = 4;

powerupClass.prototype = new moveDrawClass();

 // note: not yet generalized for more than one kind of powerup
function powerupClass(atX,atY) {
	this.x = atX;
	this.y = atY;
	this.frame = Math.floor(Math.random()*POWERUP_FRAMES);
	this.kind = Math.floor(Math.random()*POWERUP_KINDS);
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

	this.doEffect = function(onPlayer) {
		switch(this.kind) {
			case POWER_UP_KIND_SHOTS:
				onPlayer.shotsNumber+=4;
				playerScore+=5;
				break;
			case POWER_UP_KIND_BOMB:
				onPlayer.bombCount += 1;
				playerScore+=5;
				break;
			case POWER_UP_KIND_GHOST:
				onPlayer.ghostCount += 1;
				playerScore+=5;
				break;
			default:
				console.log("missing powerup definition in doEffect for kind: " + this.kind);
				break;
			case POWERUP_MOVEMENT:
				onPlayer.this.speed = 6;
				playerScore+=5;
				break;
		}		
	}

	this.draw = function() {
		drawAnimFrame("powerup",this.x,this.y, Math.floor(this.frame/POWER_UP_FRAME_DRAG), POWERUP_W,POWERUP_H, 0, this.kind);
	}
	this.animate = function() {
		if(++this.frame >= POWERUP_FRAMES*POWER_UP_FRAME_DRAG) {
			this.frame = 0;
		}
	}
}