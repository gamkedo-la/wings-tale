const SURFACE_SPACEFROG_W = 40;
const SURFACE_SPACEFROG_H = 34;
const SURFACE_SPACEFROG_FRAMES = 1;
const SPACEFROG_SHOT_SPEED = 5;
const SPACEFROG_SHOT_BURST = 4;
const SPACEFROG_SHOT_RELOAD = 12; // frames

spaceFrogClass.prototype = new moveDrawClass();

function spaceFrogClass(startX,startY) {
	this.myKind = GROUND_KIND_SPACEFROG; // used for level format data
	this.x = startX;
	this.origY = startY;
	this.y = 0;
	this.reloadTime = SPACEFROG_SHOT_RELOAD;
	this.frame = Math.floor(Math.random()*SURFACE_SPACEFROG_FRAMES);
	this.bombLockedOn = false; // used to keep upgraded split bombs from homing on same ground target

	this.shotAngSpin = 0;
	
	this.collW = this.collH = SURFACE_SPACEFROG_H;

	this.draw = function() {
		this.y = this.origY-bgDrawY;
		drawAnimFrame("space frog",this.x,this.y, this.frame, SURFACE_SPACEFROG_W,SURFACE_SPACEFROG_H);
	}

	this.move = function() {
		if(this.y < GAME_H) {
			if(this.reloadTime--<0) {
				this.reloadTime = SPACEFROG_SHOT_RELOAD;
				this.shotAngSpin += 0.2;
				for(var i=0;i<SPACEFROG_SHOT_BURST;i++) {
					new enemyShotClass(this.x, this.y,SPACEFROG_SHOT_SPEED,
						this.shotAngSpin+i*(Math.PI*2/(SPACEFROG_SHOT_BURST)));
				}
			}
		}
		if(this.y > GAME_H + PIXEL_MARGIN_FOR_REMOVING) {
			this.readyToRemove = true;
		}
	}

	this.animate = function() {
		if(++this.frame >= SURFACE_SPACEFROG_FRAMES) {
			this.frame = 0;
		}
	}
}